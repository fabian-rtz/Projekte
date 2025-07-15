// === Globale Variablen ===
let fileInput, triggerButton, fileLabel, viewer, ldsring, errormessage;
let validationButton, green, red, checkbox;
let xml, filename, validationStart, validationstatus = "ungültig", selectedTr = null;

// === Initialisierung ===
document.addEventListener("DOMContentLoaded", () => {
  initElements();
  initEventListeners();
  getRawInvoice();
});

function initElements() {
  fileInput = document.getElementById("upload");
  triggerButton = document.getElementById("triggerUpload");
  fileLabel = document.getElementById("file-label");
  viewer = document.getElementById("viewer");
  ldsring = document.getElementById("lds-ring");
  errormessage = document.getElementById("errormessage");
  validationButton = document.getElementById("validation");
  green = document.getElementById("green");
  red = document.getElementById("red");
  checkbox = document.getElementById("checkbox");
}

function initEventListeners() {
  checkbox.addEventListener("change", showViewerContent);
  triggerButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFileChange);
  validationButton.addEventListener("click", handleValidation);
  document.getElementById("save").addEventListener("click", handleSave);
  document.getElementById("search").addEventListener("input", handleSearch);
  document.addEventListener("click", handleDeleteClick);
}

function handleFileChange() {
  const file = fileInput.files[0];
  if (!file || !file.name.toLowerCase().endsWith(".xml")) return alert("Nur XML-Dateien erlaubt!");

  filename = file.name;
  fileLabel.innerText = `Aktive Datei: ${filename}`;
  viewer.innerText = "";
  errormessage.innerHTML = "";

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = () => {
    xml = reader.result;
    validationStart = performance.now();
    ldsring.style.display = "inline-block";
    green.style.display = "none";
    red.style.display = "none";
    validateAndSaveFile(file);
  };
}

function handleValidation() {
  if (!selectedTr) return alert("Bitte zuerst eine Datei auswählen!");

  validationStart = performance.now();
  ldsring.style.display = "inline-block";
  viewer.innerText = "";
  errormessage.innerHTML = "";
  green.style.display = "none";
  red.style.display = "none";

  validateAndSaveFile(xml, true);
}

function handleSave() {
  if (!xml) return alert("Keine XRechnung geladen.");
  const format = prompt("Möchten Sie die Datei als XML oder PDF speichern?", "xml").toLowerCase();
  if (format === "xml") return downloadXml();
  if (format === "pdf") return downloadPdf();
  alert("Ungültige Auswahl. Bitte geben Sie 'xml' oder 'pdf' ein.");
}

function handleSearch() {
  let begriff = this.value.trim();
  const match = begriff.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) {
    const [_, tag, monat, jahr] = match;
    begriff = `${jahr}-${monat}-${tag}`;
  }
  begriff.length === 0 ? getRawInvoice() : searchRawInvoice(begriff);
}

function handleDeleteClick(e) {
  if (!e.target.closest(".deletebtn")) return;
  const tr = e.target.closest("tr");
  const id = tr.cells[0].innerText;
  if (confirm(`Willst du die Rechnung mit ID ${id} wirklich löschen?`)) deleteRawInvoice(id);
}

function getValidationStatus(stdout) {
  return stdout.includes('<summary status="valid"') ? "gültig" : "ungültig";
}

function downloadXml() {
  const blob = new Blob([xml], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename || "rechnung.xml";
  link.click();
}

function downloadPdf() {
  if (!selectedTr) return alert("Bitte zuerst eine Datei auswählen.");
  const rawinvoice_id = selectedTr.cells[0].innerText;

  fetch(`/generate-pdf/${rawinvoice_id}`)
    .then(res => { if (!res.ok) throw new Error(); return res.blob(); })
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = (filename?.replace(/\.xml$/, "") || "rechnung") + ".pdf";
      link.click();
    })
    .catch(err => {
      console.error("PDF-Generierung fehlgeschlagen:", err);
      alert("PDF konnte nicht erstellt werden.");
    });
}

function validateAndSaveFile(fileOrXmlText, isFromDB = false) {
  const formData = buildFormData(fileOrXmlText, isFromDB);

  fetch("/validate", { method: "POST", body: formData })
    .then(res => res.ok ? res.json() : res.text().then(text => { throw new Error(text); }))
    .then(({ stdout, stderr }) => handleValidationSuccess(stdout, stderr, isFromDB))
    .catch(err => handleValidationError(err));
}

function buildFormData(fileOrXmlText, isFromDB) {
  const formData = new FormData();
  if (isFromDB) {
    const blob = new Blob([fileOrXmlText], { type: "text/xml" });
    formData.append("xml", blob, `${fileLabel.innerText}.xml`);
  } else {
    formData.append("xml", fileOrXmlText);
  }
  return formData;
}

function handleValidationSuccess(stdout, stderr, isFromDB) {
  ldsring.style.display = "none";
  const status = getValidationStatus(stdout);
  validationstatus = status;
  ChangeValidationButton(status, stderr);
  viewer.innerText = xml;

  const duration = ((performance.now() - validationStart) / 1000).toFixed(2);

  if (isFromDB) {
    const id = selectedTr.cells[0].innerText;
    updateStatusAndLog(id, stdout, stderr, duration);
  } else {
    saveNewRawInvoice(stdout, stderr, duration);
  }
}

function saveNewRawInvoice(stdout, stderr, duration) {
  const format = detectFormat(xml);
  const upload_date = new Date().toISOString();

  fetch("/RawInvoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      raw_xml: xml,
      original_filename: filename,
      upload_date,
      validation_status: validationstatus,
      format_type: format,
    }),
  })
    .then(res => res.json())
    .then(data => {
      const id = data.id;
      updateStatusAndLog(id, stdout, stderr, duration);
      return createInvoiceRelatedEntries(id);
    })
    .catch(err => console.error("Fehler beim Speichern der Rechnung:", err));
}

function createInvoiceRelatedEntries(id) {
  return fetch("/InvoiceFromRawInvoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawinvoice_id: id }),
  }).then(() => Promise.all([
    fetch("/BuyerFromRawInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawinvoice_id: id }),
    }),
    fetch("/SupplierFromRawInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawinvoice_id: id }),
    }),
    fetch("/InvoiceItemsFromRawInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawinvoice_id: id }),
    }),
    fetch("/PaymentInfoFromRawInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawinvoice_id: id }),
    }),
  ]));
}

function handleValidationError(err) {
  console.error("Fehler:", err.message);
  alert("Fehler beim Hochladen:\n" + err.message);
  ldsring.style.display = "none";
}

function ChangeValidationButton(status, stderr) {
  if (status === "gültig" || status === "valid") {
    green.style.display = "block";
    red.style.display = "none";
  } else {
    green.style.display = "none";
    red.style.display = "block";
    loadErrorMessage(stderr);
  }
}

function loadErrorMessage(stderr) {
  const regex = /\[([A-Z]+(?:-[A-Z]+)*-\d+)\][\s:-]*(.+?)\[ID\s+\1\]/gs;
  const regelMap = new Map();
  let match;
  while ((match = regex.exec(stderr)) !== null) {
    const regelId = match[1].trim();
    const beschreibung = match[2].trim();
    regelMap.set(regelId, beschreibung);
  }

  errormessage.innerHTML = `
    <div class="error-title">Gefundene Regelverletzungen:</div>
    <ul class="error-list">
      ${Array.from(regelMap.entries())
        .map(([regel, text]) => `<li><span class="regel-id">${regel}</span>: ${text}</li>`)
        .join("")}
    </ul>`;
}

function detectFormat(xml) {
  if (xml.includes("CrossIndustryInvoice") || xml.includes(":rsm:")) return "CII";
  if (xml.includes("ubl") || xml.includes('Invoice xmlns="urn:oasis:names:specification:ubl')) return "UBL";
  return "unknown";
}

function getRawInvoice() {
  fetch("/RawInvoice")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabellenBody");
      tbody.innerHTML = "";
      data.forEach(invoice => {
        tbody.innerHTML += `
          <tr onclick="highlightTd(this)" style="cursor:pointer">
            <td class="rawinvoice_id">${invoice.rawinvoice_id}</td>
            <td class="original_filename">${invoice.original_filename}</td>
            <td class="validation_status">${invoice.validation_status}</td>
            <td class="format_type">${invoice.format_type}</td>
            <td class="uploaddate">${formatDate(invoice.upload_date)}</td>
            <td><button class="deletebtn"><img src="../IMG/bin.png"></button></td>
          </tr>`;
      });
    });
}

function searchRawInvoice(begriff) {
  fetch(`/RawInvoice/search?q=${encodeURIComponent(begriff)}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabellenBody");
      tbody.innerHTML = "";
      data.forEach(invoice => {
        tbody.innerHTML += `
          <tr onclick="highlightTd(this)" style="cursor:pointer">
            <td class="rawinvoice_id">${invoice.rawinvoice_id}</td>
            <td class="original_filename">${invoice.original_filename}</td>
            <td class="validation_status">${invoice.validation_status}</td>
            <td class="format_type">${invoice.format_type}</td>
            <td class="uploaddate">${formatDate(invoice.upload_date)}</td>
            <td><button class="deletebtn"><img src="../IMG/bin.png"></button></td>
          </tr>`;
      });
    });
}

function updateStatusAndLog(id, stdout, stderr, duration) {
  fetch(`/RawInvoice/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ validation_status: validationstatus }),
  })
    .then(() => {
      setValidationLog(id, stdout, stderr, duration);
      getRawInvoice();
      showDataFromRawInvoiceDB(id);
    })
    .catch((err) => console.error("Fehler beim Update:", err));
}

function highlightTd(tr) {
  document.querySelectorAll("tr").forEach(row => row.classList.remove("highlight"));
  tr.classList.add("highlight");
  selectedTr = tr;
  const id = tr.cells[0].innerText;
  showDataFromRawInvoiceDB(id);
  showDataFromValidationLog(id);
}

function showDataFromRawInvoiceDB(id) {
  fetch(`/RawInvoice/${id}`)
    .then(res => res.json())
    .then(data => {
      xml = data.raw_xml;
      fileLabel.innerText = data.original_filename;
      showViewerContent();
    });
}

function showDataFromValidationLog(id) {
  fetch(`/ValidationLog/byRawInvoice/${id}`)
    .then(res => res.json())
    .then(data => {
      loadErrorMessage(data.error_details);
      const status = getValidationStatus(data.raw_output);
      ChangeValidationButton(status, data.error_details);
    });
}

function setValidationLog(id, stdout, stderr, duration) {
  fetch("/ValidationLog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rawinvoice_id: id,
      validated_at: new Date().toISOString(),
      validation_time: duration,
      error_details: stderr,
      raw_output: stdout,
    }),
  });
}

function deleteRawInvoice(id) {
  fetch(`/RawInvoice/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Fehler beim Löschen");
      getRawInvoice();
      viewer.innerText = "";
      errormessage.innerHTML = "";
      fileLabel.innerText = "";
      green.style.display = "none";
      red.style.display = "none";
      selectedTr = null;
      xml = null;
      filename = null;
    })
    .catch(err => console.error("Löschfehler:", err.message));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function showViewerContent() {
  if (!xml || !selectedTr) return;
  const rawinvoice_id = selectedTr.cells[0].innerText;

  if (checkbox.checked) {
    fetch(`/templateData/${rawinvoice_id}`)
      .then(res => res.json())
      .then(renderTemplateData)
      .catch(err => {
        console.error("Fehler beim Laden der Template-Daten:", err);
        viewer.innerText = "Fehler beim Laden der strukturierten Rechnung.";
      });
  } else {
    viewer.innerText = xml;
  }
}


function renderTemplateData(data) {
  const { invoice = {}, buyer = {}, supplier = {}, paymentInfo = {}, items = [] } = data;
  let html = `<code>`;

  html += renderInvoiceData(invoice);
  html += renderBuyer(buyer);
  html += renderSupplier(supplier);
  html += renderPaymentInfo(paymentInfo);
  html += renderItems(items);

  html += `</code>`;
  viewer.innerHTML = html;
}

function renderInvoiceData(invoice) {
  let html = "";
  if (invoice.invoice_no) html += `<strong>Rechnungsnummer</strong>: ${invoice.invoice_no}<br>`;
  if (invoice.issue_date) html += `<strong>Rechnungsdatum</strong>: ${invoice.issue_date}<br>`;
  if (invoice.delivery_date) html += `<strong>Lieferdatum</strong>: ${invoice.delivery_date}<br>`;
  if (invoice.due_date) html += `<strong>Zahlungsziel</strong>: ${invoice.due_date}<br>`;
  if (invoice.total_net_amount != null) html += `<strong>Nettobetrag</strong>: ${invoice.total_net_amount.toFixed(2)} €<br>`;
  if (invoice.total_tax_amount != null) html += `<strong>Steuerbetrag</strong>: ${invoice.total_tax_amount.toFixed(2)} €<br>`;
  if (invoice.grand_total_amount != null) html += `<strong>Gesamtbetrag</strong>: ${invoice.grand_total_amount.toFixed(2)} €<br>`;
  if (invoice.included_note) html += `<strong>Bemerkung</strong>: ${invoice.included_note}<br><br>`;
  return html;
}

function renderBuyer(buyer) {
  let html = "";
  if (buyer.name || buyer.address || buyer.reference) {
    html += `<strong>Empfänger</strong>:<br>`;
    if (buyer.name || buyer.address) html += `• ${buyer.name}${buyer.address}<br>`;
    if (buyer.vat_id) html += `• USt-ID: ${buyer.vat_id}<br>`;
    if (buyer.buyer_reference) html += `• Referenz: ${buyer.buyer_reference}<br>`;
    html += `<br>`;
  }
  return html;
}

function renderSupplier(supplier) {
  let html = "";
  if (supplier.name || supplier.address) {
    html += `<strong>Lieferant</strong>:<br>`;
    if (supplier.name || supplier.address) html += `• ${supplier.name}${supplier.address}<br>`;
    if (supplier.vat_id) html += `• USt-ID: ${supplier.vat_id}<br>`;
    html += `<br>`;
  }
  return html;
}

function renderPaymentInfo(paymentInfo) {
  let html = "";
  if (paymentInfo.IBAN || paymentInfo.payment_terms) {
    html += `<strong>Zahlung</strong>:<br>`;
    if (paymentInfo.IBAN) html += `• IBAN: ${paymentInfo.IBAN}<br>`;
    if (paymentInfo.BIC) html += `• BIC: ${paymentInfo.BIC}<br>`;
    if (paymentInfo.payment_terms) html += `• Zahlungsbedingungen: ${paymentInfo.payment_terms}<br>`;
    if (paymentInfo.skonto_percent != null && paymentInfo.skonto_days != null)
      html += `• Skonto: ${paymentInfo.skonto_percent}% bei Zahlung innerhalb ${paymentInfo.skonto_days} Tagen<br><br>`;
  }
  return html;
}

function renderItems(items) {
  let html = "";
  if (items.length > 0) {
    html += `<strong>Positionen</strong>:<br>`;
    items.forEach((item, i) => {
      html += `#${i + 1}: ${item.product_name || "-"} `;
      if (item.quantity != null && item.unit_price != null) {
        html += `– ${item.quantity} x ${item.unit_price.toFixed(2)} €`;
      }
      if (item.line_total != null) {
        html += ` = ${item.line_total.toFixed(2)} €`;
      }
      html += `<br>`;
    });
  }
  return html;
}

