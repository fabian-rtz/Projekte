const { XMLParser } = require("fast-xml-parser");
const db = require("../db");

function insertInvoiceItem(data, callback) {
  const sql = `
    INSERT INTO InvoiceItem (
      invoice_id, line_no, product_name, description,
      quantity, unit_price, unit_code,
      line_total, tax_rate, line_tax_amount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.invoice_id,
    data.line_no,
    data.product_name,
    data.description,
    data.quantity,
    data.unit_price,
    data.unit_code,
    data.line_total,
    data.tax_rate,
    data.line_tax_amount
  ];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

function getText(val) {
  if (!val) return null;
  if (typeof val === "object" && "#text" in val) return val["#text"];
  return val;
}

function processInvoiceItemsFromRawInvoiceId(rawinvoice_id, callback) {
  db.get("SELECT raw_xml, format_type FROM RawInvoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("RawInvoice nicht gefunden"));

    const { raw_xml, format_type } = row;
    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true,
      attributeNamePrefix: "@_"
    });

    const xml = parser.parse(raw_xml);

    db.get("SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, invoiceRow) => {
      if (err) return callback(err);
      if (!invoiceRow) return callback(new Error("Zugehörige Invoice nicht gefunden"));

      const invoice_id = invoiceRow.invoice_id;

      try {
        let items = [];

        if (format_type === "UBL") {
          items = xml?.Invoice?.InvoiceLine || [];
          if (!Array.isArray(items)) items = [items];

          items.forEach((item, index) => {
            const quantityNode = item?.InvoicedQuantity;
            const quantity = parseFloat(getText(quantityNode) || 0);
            const unitCode = quantityNode?.["@_unitCode"] || null;

            const data = {
              invoice_id,
              line_no: parseInt(item?.ID || index + 1),
              product_name: item?.Item?.Name || null,
              description: item?.Item?.Description || null,
              quantity,
              unit_price: parseFloat(getText(item?.Price?.PriceAmount) || 0),
              unit_code: unitCode,
              line_total: parseFloat(getText(item?.LineExtensionAmount) || 0),
              tax_rate: parseFloat(item?.TaxTotal?.TaxSubtotal?.Percent || 0),
              line_tax_amount: parseFloat(getText(item?.TaxTotal?.TaxAmount) || 0)
            };

            insertInvoiceItem(data, (err) => {
              if (err) console.error("❌ Fehler beim Speichern eines Items (UBL):", err.message);
            });
          });

        } else if (format_type === "CII") {
          items = xml?.CrossIndustryInvoice?.SupplyChainTradeTransaction?.IncludedSupplyChainTradeLineItem || [];
          if (!Array.isArray(items)) items = [items];

          items.forEach((item, index) => {
            const quantityNode = item?.SpecifiedLineTradeDelivery?.BilledQuantity;
            const quantity = parseFloat(getText(quantityNode) || 0);
            const unitCode = quantityNode?.["@_unitCode"] || null;

            const data = {
              invoice_id,
              line_no: parseInt(item?.AssociatedDocumentLineDocument?.LineID || index + 1),
              product_name: item?.SpecifiedTradeProduct?.Name || null,
              description: item?.SpecifiedTradeProduct?.Description || null,
              quantity,
              unit_price: parseFloat(item?.SpecifiedLineTradeAgreement?.NetPriceProductTradePrice?.ChargeAmount || 0),
              unit_code: unitCode,
              line_total: parseFloat(item?.SpecifiedLineTradeSettlement?.SpecifiedTradeSettlementLineMonetarySummation?.LineTotalAmount || 0),
              tax_rate: parseFloat(item?.SpecifiedLineTradeSettlement?.ApplicableTradeTax?.RateApplicablePercent || 0),
              line_tax_amount: parseFloat(item?.SpecifiedLineTradeSettlement?.ApplicableTradeTax?.CalculatedAmount || 0)
            };

            insertInvoiceItem(data, (err) => {
              if (err) console.error("❌ Fehler beim Speichern eines Items (CII):", err.message);
            });
          });

        } else {
          return callback(new Error("Unbekanntes Format"));
        }

        callback(null, items.length); // Anzahl gespeicherter Positionen zurückgeben
      } catch (err) {
        callback(err);
      }
    });
  });
}

module.exports = { processInvoiceItemsFromRawInvoiceId };
