const { XMLParser } = require("fast-xml-parser");
const db = require("../db");

function insertInvoice(data, callback) {
  const sql = `
    INSERT INTO Invoice (
      invoice_no, invoice_type_code, document_type_code, profile,
      issue_date, delivery_date, due_date, included_note,
      total_net_amount, total_tax_amount, grand_total_amount,
      rawinvoice_id, buyer_id, supplier_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.invoice_no,
    data.invoice_type_code,
    data.document_type_code,
    data.profile,
    data.issue_date,
    data.delivery_date,
    data.due_date,
    data.included_note,
    data.total_net_amount,
    data.total_tax_amount,
    data.grand_total_amount,
    data.rawinvoice_id,
    data.buyer_id,
    data.supplier_id
  ];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

function processInvoiceFromRawInvoiceId(rawinvoice_id, callback) {
  db.get("SELECT raw_xml, format_type FROM RawInvoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("RawInvoice nicht gefunden"));

    const { raw_xml, format_type } = row;
    const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
    const xml = parser.parse(raw_xml);
    let invoiceData = {};

    try {
      db.get("SELECT buyer_id FROM Buyer ORDER BY buyer_id DESC LIMIT 1", (err, buyerRow) => {
        if (err) return callback(err);

        db.get("SELECT supplier_id FROM Supplier ORDER BY supplier_id DESC LIMIT 1", (err, supplierRow) => {
          if (err) return callback(err);

          const buyer_id = buyerRow?.buyer_id || null;
          const supplier_id = supplierRow?.supplier_id || null;

          const getText = (node) => typeof node === 'object' && node !== null ? node['#text'] || null : node;

          if (format_type === "CII") {
            const invoice = xml?.CrossIndustryInvoice;
            const header = invoice?.ExchangedDocument;
            const transaction = invoice?.SupplyChainTradeTransaction;
            const settlement = transaction?.ApplicableHeaderTradeSettlement;

            const taxAmount = settlement?.ApplicableTradeTax?.CalculatedAmount;

            invoiceData = {
              invoice_no: header?.ID || null,
              invoice_type_code: header?.TypeCode || null,
              document_type_code: header?.TypeCode || null,
              profile: invoice?.ExchangedDocumentContext?.GuidelineSpecifiedDocumentContextParameter?.ID || null,
              issue_date: getText(header?.IssueDateTime?.DateTimeString) || null,
              delivery_date: getText(transaction?.ApplicableHeaderTradeDelivery?.ActualDeliverySupplyChainEvent?.OccurrenceDateTime?.DateTimeString) || null,
              due_date: getText(settlement?.SpecifiedTradePaymentTerms?.DueDateDateTime?.DateTimeString) || null,
              included_note: Array.isArray(header?.IncludedNote)
                ? header?.IncludedNote[0]?.Content
                : header?.IncludedNote?.Content || null,
              total_net_amount: parseFloat(settlement?.SpecifiedTradeSettlementHeaderMonetarySummation?.LineTotalAmount || 0),
              total_tax_amount: parseFloat(getText(taxAmount) || 0),
              grand_total_amount: parseFloat(settlement?.SpecifiedTradeSettlementHeaderMonetarySummation?.GrandTotalAmount || 0),
              rawinvoice_id,
              buyer_id,
              supplier_id
            };
          }

          else if (format_type === "UBL") {
            const inv = xml?.Invoice;
            const getText = (node) => typeof node === 'object' && node !== null ? node['#text'] || null : node;

            invoiceData = {
              invoice_no: inv?.ID || null,
              invoice_type_code: inv?.InvoiceTypeCode || null,
              document_type_code: inv?.DocumentTypeCode || null,
              profile: inv?.CustomizationID || null,
              issue_date: getText(inv?.IssueDate) || null,
              delivery_date: getText(inv?.Delivery?.ActualDeliveryDate) || null,
              due_date: getText(inv?.DueDate) || null, // ✅ korrekt
              included_note: Array.isArray(inv?.Note)
                ? inv?.Note[0]
                : inv?.Note || null,
              total_net_amount: parseFloat(getText(inv?.LegalMonetaryTotal?.LineExtensionAmount || 0)),
              total_tax_amount: parseFloat(getText(inv?.TaxTotal?.TaxAmount || 0)),
              grand_total_amount: parseFloat(getText(inv?.LegalMonetaryTotal?.PayableAmount || 0)),
              rawinvoice_id,
              buyer_id,
              supplier_id
            };
          }

          else {
            return callback(new Error("Unbekanntes Format"));
          }

          insertInvoice(invoiceData, (err, invoiceId) => {
            if (err) return callback(err);
            callback(null, invoiceId);
          });
        });
      });
    } catch (err) {
      callback(err);
    }
  });
}

module.exports = { processInvoiceFromRawInvoiceId };
