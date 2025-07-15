const { XMLParser } = require("fast-xml-parser");
const db = require("../db");

function insertSupplier(data, callback) {
  const sql = `
    INSERT INTO Supplier (name, address, contact, tax_registration, vat_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    data.name,
    data.address,
    data.contact,
    data.tax_registration,
    data.vat_id,
  ];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

function getText(val) {
  return typeof val === "object" && val !== null ? val["#text"] || null : val || null;
}

function extractTaxRegistration(taxNode) {
  if (Array.isArray(taxNode)) {
    return taxNode
      .map(t => getText(t.ID))
      .find(id => id) || null;
  }
  return getText(taxNode?.ID) || null;
}

function processSupplierFromRawInvoiceId(rawinvoice_id, callback) {
  db.get("SELECT raw_xml, format_type FROM RawInvoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("RawInvoice nicht gefunden"));

    const { raw_xml, format_type } = row;
    const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
    const xml = parser.parse(raw_xml);

    let supplierData = {};

    try {
      if (format_type === "UBL") {
        const sellerParty = xml?.Invoice?.AccountingSupplierParty?.Party;
        if (!sellerParty) return callback(new Error("SupplierParty (UBL) nicht gefunden"));

        supplierData = {
          name:
          Array.isArray(sellerParty?.PartyLegalEntity)
            ? sellerParty?.PartyLegalEntity[0]?.RegistrationName
            : sellerParty?.PartyLegalEntity?.RegistrationName ||
              sellerParty?.PartyName?.Name ||
              null,
          address: `${sellerParty?.PostalAddress?.StreetName || ""}, ${sellerParty?.PostalAddress?.PostalZone || ""} ${sellerParty?.PostalAddress?.CityName || ""}`.trim(),
          contact: sellerParty?.Contact?.Name || null,
          tax_registration: getText(sellerParty?.PartyTaxScheme?.CompanyID),
          vat_id: getText(sellerParty?.PartyTaxScheme?.CompanyID)
        };

      } else if (format_type === "CII") {
        const sellerParty = xml?.CrossIndustryInvoice
          ?.SupplyChainTradeTransaction
          ?.ApplicableHeaderTradeAgreement
          ?.SellerTradeParty;

        if (!sellerParty) return callback(new Error("SellerTradeParty (CII) nicht gefunden"));

        supplierData = {
          name: sellerParty?.Name || null,
          address: `${sellerParty?.PostalTradeAddress?.LineOne || ""}, ${sellerParty?.PostalTradeAddress?.PostcodeCode || ""} ${sellerParty?.PostalTradeAddress?.CityName || ""}`.trim(),
          contact: sellerParty?.DefinedTradeContact?.PersonName || null,
          tax_registration: extractTaxRegistration(sellerParty?.SpecifiedTaxRegistration),
          vat_id: getText(sellerParty?.SpecifiedTaxRegistration?.ID)
        };

      } else {
        return callback(new Error("Unbekanntes Format"));
      }

      insertSupplier(supplierData, (err, supplierId) => {
        if (err) return callback(err);
        callback(null, supplierId);
      });

    } catch (err) {
      callback(err);
    }
  });
}

module.exports = { processSupplierFromRawInvoiceId };
