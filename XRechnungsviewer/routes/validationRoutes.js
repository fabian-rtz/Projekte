const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const express = require("express");
const db = require("../SQLite/db");
const PDFDocument = require("pdfkit");

const { insertRawInvoice } = require("../SQLite/tables/RawInvoice");
const { insertValidationLog } = require("../SQLite/tables/ValidationLog");
const { processBuyerFromRawInvoiceId } = require("../SQLite/tables/Buyer");
const { processSupplierFromRawInvoiceId } = require("../SQLite/tables/Supplier");
const { processPaymentInfoFromRawInvoiceId } = require("../SQLite/tables/PaymentInfo");


const JAR_PATH = path.resolve(
  __dirname,
  "..",
  "mustangproject-master",
  "mustangproject-master",
  "Mustang-CLI",
  "target",
  "Mustang-CLI-2.16.4-SNAPSHOT.jar"
);

const JAVA_PATH = path.resolve(
  __dirname, 
  "..", 
  "java", 
  "bin", 
  "java.exe"
);

module.exports = function (app, upload, staticDir) {

  
  //  Startseite
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "HTML", "index.html"));
  });

  //  Statische Dateien bereitstellen
  app.use(express.static(staticDir));
  console.log("Statischer Pfad:", staticDir);

  //  Datei-Upload & Validierung
  app.post("/validate", upload.single("xml"), async (req, res) => {
    if (!req.file) return res.status(400).send("Keine Datei empfangen.");

    const filePath = path.resolve(req.file.path);

    try {
      const { stdout, stderr, code } = await runValidationJar(filePath);

      fs.unlink(filePath, () => {}); // Datei löschen

      const decodedStdout = decode(stdout);
      const decodedStderr = decode(stderr);
      const output = decodedStdout + decodedStderr;

      if (code !== 0 && !output.includes("<summary")) {
        console.error("Fehler bei der Validierung:", output);
        return res.status(500).send("Fehler bei der Validierung.");
      }

      res.json({ stdout: decodedStdout, stderr: decodedStderr });
    } catch (err) {
      console.error("Unerwarteter Fehler:", err);
      res.status(500).send("Interner Serverfehler.");
    }
  });

  
  app.patch("/RawInvoice/:id", express.json(), (req, res) => {

    const id = req.params.id;
    const { validation_status } = req.body;
  
    if (typeof validation_status !== "string" || !["gültig", "ungültig"].includes(validation_status)) {
      return res.status(400).json({ error: "validation_status fehlt oder ist ungültig." });
    }
  
    const sql = `UPDATE RawInvoice SET validation_status = ? WHERE rawinvoice_id = ?`;
  
    db.run(sql, [validation_status, id], function (err) {
      if (err) {
        console.error("Fehler beim Aktualisieren der RawInvoice:", err.message);
        return res.status(500).json({ error: "Fehler beim Aktualisieren der RawInvoice" });
      }
  
      if (this.changes === 0) {
        return res.status(404).json({ error: "RawInvoice nicht gefunden." });
      }
  
      console.log(`RawInvoice ${id} erfolgreich aktualisiert.`);
      res.json({ message: "RawInvoice erfolgreich aktualisiert." });
    });
  });

app.get("/generate-pdf/:id", (req, res) => {
  const id = req.params.id;

  const invoiceQuery = `SELECT * FROM Invoice WHERE rawinvoice_id = ?`;
  const buyerQuery = `SELECT * FROM Buyer WHERE buyer_id = (SELECT buyer_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const supplierQuery = `SELECT * FROM Supplier WHERE supplier_id = (SELECT supplier_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const paymentQuery = `SELECT * FROM PaymentInfo WHERE invoice_id = (SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const itemsQuery = `SELECT * FROM InvoiceItem WHERE invoice_id = (SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?)`;

  const PDFDocument = require("pdfkit");
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "..", "rechnung.pdf");
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  const formatDate = (str) => {
    if (!str || str.length !== 8) return str || "-";
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6)}`;
  };

  db.get(invoiceQuery, [id], (err, invoice) => {
    if (err || !invoice) return res.status(500).send("Fehler bei Invoice");

    db.get(buyerQuery, [id], (err, buyer) => {
      if (err) return res.status(500).send("Fehler bei Buyer");

      db.get(supplierQuery, [id], (err, supplier) => {
        if (err) return res.status(500).send("Fehler bei Supplier");

        db.get(paymentQuery, [id], (err, paymentInfo) => {
          if (err) return res.status(500).send("Fehler bei PaymentInfo");

          db.all(itemsQuery, [id], (err, items) => {
            if (err) return res.status(500).send("Fehler bei Items");

            doc.fontSize(20).text("Rechnung", { align: "center" });
            doc.moveDown();
            doc.fontSize(12);

            // === Allgemeine Rechnungsdaten ===
            doc.text(`Rechnungsnummer: ${invoice.invoice_no || "-"}`);
            doc.text(`Rechnungsdatum: ${formatDate(invoice.issue_date)}`);
            doc.text(`Lieferdatum: ${formatDate(invoice.delivery_date)}`);
            doc.text(`Zahlungsziel: ${formatDate(invoice.due_date)}`);
            if (invoice.total_net_amount != null) doc.text(`Nettobetrag: ${invoice.total_net_amount.toFixed(2)} €`);
            if (invoice.total_tax_amount != null) doc.text(`Steuerbetrag: ${invoice.total_tax_amount.toFixed(2)} €`);
            if (invoice.grand_total_amount != null) doc.text(`Gesamtbetrag: ${invoice.grand_total_amount.toFixed(2)} €`);
            if (invoice.included_note) doc.text(`Bemerkung: ${invoice.included_note}`);
            doc.moveDown();

            // === Käufer ===
            if (buyer.name || buyer.address || buyer.buyer_reference) {
              doc.text("Empfänger:");
              if (buyer.name || buyer.address)
                doc.text(`• ${buyer.name || ""} ${buyer.address || ""}`.trim());
              if (buyer.vat_id) doc.text(`• USt-ID: ${buyer.vat_id}`);
              if (buyer.buyer_reference) doc.text(`• Referenz: ${buyer.buyer_reference}`);
              doc.moveDown();
            }

            // === Lieferant ===
            if (supplier.name || supplier.address || supplier.vat_id) {
              doc.text("Lieferant:");
              if (supplier.name || supplier.address)
                doc.text(`• ${supplier.name || ""} ${supplier.address || ""}`.trim());
              if (supplier.vat_id) doc.text(`• USt-ID: ${supplier.vat_id}`);
              doc.moveDown();
            }

            // === Zahlung ===
            if (
              paymentInfo?.IBAN ||
              paymentInfo?.BIC ||
              paymentInfo?.payment_terms ||
              paymentInfo?.skonto_percent != null
            ) {
              doc.text("Zahlung:");
              if (paymentInfo.IBAN) doc.text(`• IBAN: ${paymentInfo.IBAN}`);
              if (paymentInfo.BIC) doc.text(`• BIC: ${paymentInfo.BIC}`);
              if (paymentInfo.payment_terms) doc.text(`• Zahlungsbedingungen: ${paymentInfo.payment_terms}`);
              if (paymentInfo.skonto_percent != null && paymentInfo.skonto_days != null)
                doc.text(`• Skonto: ${paymentInfo.skonto_percent}% bei Zahlung innerhalb ${paymentInfo.skonto_days} Tagen`);
              doc.moveDown();
            }
          console.log("Invoice Items:", items);
                // === Positionen ===
            if (items.length > 0) {
              doc.text("Positionen:");
              items.forEach((item, i) => {
                const name = item.item_name || "-";
                const quantity = item.qty ?? 0;
                const price = item.price_each ?? 0;
                const total = item.line_total ?? (quantity * price);
                doc.text(`${i + 1}. ${name} - ${quantity} x ${price.toFixed(2)} € = ${total.toFixed(2)} €`);
              });
            }
            doc.end();
            stream.on("finish", () => {
              res.download(filePath);
            });
          });
        });
      });
    });
  });
});


app.get("/templateData/:id", (req, res) => {
  const id = req.params.id;

  const invoiceQuery = `SELECT * FROM Invoice WHERE rawinvoice_id = ?`;
  const buyerQuery = `SELECT * FROM Buyer WHERE buyer_id = (SELECT buyer_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const supplierQuery = `SELECT * FROM Supplier WHERE supplier_id = (SELECT supplier_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const paymentQuery = `SELECT * FROM PaymentInfo WHERE invoice_id = (SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?)`;
  const itemsQuery = `SELECT * FROM InvoiceItem WHERE invoice_id = (SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?)`;  

  const response = {};

  db.get(invoiceQuery, [id], (err, invoice) => {
    if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Invoice." });
    if (!invoice) return res.status(404).json({ error: "Rechnung nicht gefunden." });
    response.invoice = invoice;

    db.get(buyerQuery, [id], (err, buyer) => {
      if (err) return res.status(500).json({ error: "Fehler beim Abrufen des Käufers." });
      response.buyer = buyer;

      db.get(supplierQuery, [id], (err, supplier) => {
        if (err) return res.status(500).json({ error: "Fehler beim Abrufen des Lieferanten." });
        response.supplier = supplier;

        db.get(paymentQuery, [id], (err, paymentInfo) => {
          if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Zahlung." });
          response.paymentInfo = paymentInfo;

          db.all(itemsQuery, [id], (err, items) => {
            if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Positionen." });
            response.items = items;
            res.json(response);
          });
        });
      });
    });
  });
});

  app.post("/PaymentInfoFromRawInvoice", express.json(), (req, res) => {
    const { rawinvoice_id } = req.body;
    if (!rawinvoice_id) return res.status(400).json({ error: "rawinvoice_id fehlt" });
  
    processPaymentInfoFromRawInvoiceId(rawinvoice_id, (err, payment_id) => {
      if (err) {
        console.error("Fehler bei PaymentInfo:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ payment_id });
    });
  });
  
    // • API-Endpunkt zum Speichern eines Supplier anhand rawinvoice_id
  app.post("/SupplierFromRawInvoice", express.json(), (req, res) => {
    const { rawinvoice_id } = req.body;
    if (!rawinvoice_id) return res.status(400).json({ error: "rawinvoice_id fehlt" });

    processSupplierFromRawInvoiceId(rawinvoice_id, (err, supplierId) => {
      if (err) {
        console.error("Fehler beim Extrahieren Supplier:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ supplier_id: supplierId });
    });
  });

  app.post("/InvoiceFromRawInvoice", express.json(), (req, res) => {
    const { rawinvoice_id } = req.body;
    if (!rawinvoice_id) return res.status(400).json({ error: "rawinvoice_id fehlt" });
  
    const { processInvoiceFromRawInvoiceId } = require("../SQLite/tables/Invoice");
    processInvoiceFromRawInvoiceId(rawinvoice_id, (err, invoiceId) => {
      if (err) {
        console.error("Fehler beim Extrahieren Invoice:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ invoice_id: invoiceId });
    });
  });

  app.post("/BuyerFromRawInvoice", express.json(), (req, res) => {
    const { rawinvoice_id } = req.body;
    if (!rawinvoice_id) return res.status(400).json({ error: "rawinvoice_id fehlt" });
  
    processBuyerFromRawInvoiceId(rawinvoice_id, (err, buyerId) => {
      if (err) {
        console.error("Fehler beim Extrahieren Buyer:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      res.json({ buyer_id: buyerId });
    });
  });

  // ValidationLog über rawinvoice_id finden
  app.get("/ValidationLog/byRawInvoice/:rawinvoice_id", (req, res) => {
    
    const rawinvoice_id = req.params.rawinvoice_id;

    db.get("SELECT * FROM ValidationLog WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
      if (err) {
        console.error("Fehler beim Abrufen ValidationLog by RawInvoice:", err.message);
        return res.status(500).json({ error: "Fehler beim Abrufen" });
      }

      if (!row) {
        return res.status(404).json({ error: "ValidationLog nicht gefunden" });
      }

      res.json(row);
    });
  });

    //  XML + Metadaten in Datenbank speichern
    app.post("/RawInvoice", express.json(), (req, res) => {
      const data = req.body;
  
      if (!data.raw_xml || !data.original_filename) {
        return res.status(400).json({ error: "Fehlende Daten." });
      }
  
      insertRawInvoice(data, (err, id) => {
        if (err) {
          console.error(" Fehler beim Einfügen in DB:", err);
          return res.status(500).json({ error: "Datenbankfehler" });
        }
  
        console.log(" RawInvoice gespeichert mit ID:", id);
        res.json({ id });
      });
    });

        // Alle RawInvoice-Einträge abrufen
    app.get("/RawInvoice", (req, res) => {
      const sqlite3 = require("sqlite3").verbose();
     

      const sql = `SELECT * FROM RawInvoice ORDER BY rawinvoice_id ASC`;

      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error("Fehler beim Abrufen der Daten:", err.message);
          return res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
        }

        res.json(rows);
      });
    });

    app.delete('/RawInvoice/:id', (req, res) => {
      const id = req.params.id;
      db.run('DELETE FROM RawInvoice WHERE rawinvoice_id = ?', [id], function(err) {
        if (err) {
          console.error(err);
          res.status(500).send("Fehler beim Löschen");
        } else {
          res.sendStatus(204); // 204 = erfolgreich gelöscht, kein Inhalt
        }
      });
    });

    app.get("/RawInvoice/search", (req, res) => {
      const search = `%${req.query.q?.toLowerCase() || ""}%`;

      db.all(
        `SELECT * FROM RawInvoice
         WHERE LOWER(original_filename) LIKE ?
            OR DATE(upload_date) LIKE ?
            OR LOWER(format_type) LIKE ?
            OR LOWER(validation_status) LIKE ?`,
        [search, search, search, search],
        (err, rows) => {
          if (err) return res.status(500).send("Fehler bei der Suche");
          res.json(rows);
        }
      );
    });


      // Einzelne RawInvoice per ID abrufen
      app.get("/RawInvoice/:id", (req, res) => {

        const id = req.params.id;

        db.get("SELECT * FROM RawInvoice WHERE rawinvoice_id = ?", [id], (err, row) => {
          if (err) {
            console.error("Fehler beim Abrufen:", err.message);
            return res.status(500).json({ error: "Fehler beim Abrufen" });
          }

          if (!row) {
            return res.status(404).json({ error: "RawInvoice nicht gefunden" });
          }

          res.json(row);
        });
      });

      app.post("/ValidationLog", express.json(), (req, res) => {
        const { rawinvoice_id, validated_at, validation_time, error_details, raw_output } = req.body;
      
        if (!rawinvoice_id || !validated_at || !validation_time) {
          return res.status(400).json({ error: "Fehlende Pflichtfelder." });
        }
      
        insertValidationLog(req.body, (err, id) => {
          if (err) {
            console.error("Fehler beim Einfügen des ValidationLogs:", err);
            return res.status(500).json({ error: "Datenbankfehler beim Loggen" });
          }
      
          res.json({ log_id: id });
        });
      });

};


function decode(buffer) {
  return Buffer.from(buffer).toString("latin1");
}

function runValidationJar(filePath) {
  return new Promise((resolve, reject) => {
    console.log("Starte JAR mit:");
    console.log(`java/bin/java.exe -jar "${JAR_PATH}" --action validate --source "${filePath}"`);

    const java = spawn(JAVA_PATH, ["-jar", JAR_PATH, "--action", "validate", "--source", filePath]);

    let stdout = '';
    let stderr = '';

    
    java.stdout.on("data", (data) => {
      stdout += data.toString();
    });


    java.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    java.on("close", (code) => {
      resolve({ stdout, stderr, code });
    });

    java.on("error", reject);  
  });
}
