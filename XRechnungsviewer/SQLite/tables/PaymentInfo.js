const { XMLParser } = require("fast-xml-parser");
const db = require("../db");

function insertPaymentInfo(data, callback) {
  const sql = `
    INSERT INTO PaymentInfo (
      invoice_id, payment_type_code, IBAN, BIC,
      payment_terms, skonto_percent, skonto_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.invoice_id,
    data.payment_type_code,
    data.IBAN,
    data.BIC,
    data.payment_terms,
    data.skonto_percent,
    data.skonto_days
  ];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

function processPaymentInfoFromRawInvoiceId(rawinvoice_id, callback) {
  db.get("SELECT raw_xml, format_type FROM RawInvoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("RawInvoice nicht gefunden"));

    const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
    const xml = parser.parse(row.raw_xml);
    const format = row.format_type;

    let paymentData = {
      payment_type_code: null,
      IBAN: null,
      BIC: null,
      payment_terms: null,
      skonto_percent: null,
      skonto_days: null
    };

    const getText = (val) => typeof val === "object" && val !== null ? val["#text"] || null : val;

    try {
      if (format === "CII") {
        const settlement = xml?.CrossIndustryInvoice?.SupplyChainTradeTransaction?.ApplicableHeaderTradeSettlement;
        if (!settlement) return callback(new Error("CII-Settlement nicht gefunden"));

        // Wandle ggf. Array um
        const pmArray = settlement?.SpecifiedTradeSettlementPaymentMeans;
        const paymentMeans = Array.isArray(pmArray) ? pmArray[0] : pmArray || {};

        const termsArray = settlement?.SpecifiedTradePaymentTerms;
        const terms = Array.isArray(termsArray) ? termsArray[0] : termsArray || {};

        paymentData.payment_type_code = parseInt(getText(paymentMeans?.TypeCode)) || null;
        paymentData.IBAN = getText(paymentMeans?.PayeePartyCreditorFinancialAccount?.IBANID);
        paymentData.BIC = getText(paymentMeans?.PayeeSpecifiedCreditorFinancialInstitution?.BICID);
        paymentData.payment_terms = getText(terms?.Description);

      } else if (format === "UBL") {
        const invoice = xml?.Invoice;
        if (!invoice) return callback(new Error("UBL-Invoice nicht gefunden"));

        const paymentMeansArray = invoice?.PaymentMeans;
        const paymentMeans = Array.isArray(paymentMeansArray) ? paymentMeansArray[0] : paymentMeansArray || {};

        const financialAccount = paymentMeans?.PayeeFinancialAccount || {};
        const termsArray = invoice?.PaymentTerms;
        const terms = Array.isArray(termsArray) ? termsArray[0] : termsArray || {};

        paymentData.payment_type_code = parseInt(getText(paymentMeans?.PaymentMeansCode)) || null;
        paymentData.IBAN = getText(financialAccount?.ID);
        paymentData.BIC = getText(financialAccount?.FinancialInstitutionBranch?.ID);
        paymentData.payment_terms = getText(terms?.Note);
      } else {
        return callback(new Error("Unbekanntes Format"));
      }

      db.get("SELECT invoice_id FROM Invoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
        if (err) return callback(err);
        if (!row) return callback(new Error("Invoice zu RawInvoice nicht gefunden"));

        paymentData.invoice_id = row.invoice_id;

        insertPaymentInfo(paymentData, callback);
      });

    } catch (e) {
      callback(e);
    }
  });
}



module.exports = { processPaymentInfoFromRawInvoiceId };