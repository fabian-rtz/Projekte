const { XMLParser } = require("fast-xml-parser");
const db = require("../db");

function insertBuyer(data, callback) {
  const sql = `
    INSERT INTO Buyer (name, address, buyer_reference, tax_registration, vat_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    data.name,
    data.address,
    data.buyer_reference,
    data.tax_registration,
    data.vat_id,
  ];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

function processBuyerFromRawInvoiceId(rawinvoice_id, callback) {
  db.get("SELECT raw_xml, format_type FROM RawInvoice WHERE rawinvoice_id = ?", [rawinvoice_id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("RawInvoice nicht gefunden"));

    const { raw_xml, format_type } = row;
    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true
    });

    const xml = parser.parse(raw_xml);
    let buyerData = {};

    try {
      if (format_type === "UBL") {
        const buyerParty = xml?.Invoice?.AccountingCustomerParty?.Party;
        if (!buyerParty) return callback(new Error("BuyerParty (UBL) nicht gefunden"));

        const companyID = buyerParty?.PartyTaxScheme?.CompanyID;

        buyerData = {
          name: buyerParty?.PartyLegalEntity?.RegistrationName || buyerParty?.PartyName?.Name || null,
          address: `${buyerParty?.PostalAddress?.StreetName || ""}, ${buyerParty?.PostalAddress?.PostalZone || ""} ${buyerParty?.PostalAddress?.CityName || ""}`.trim(),
          buyer_reference: xml?.Invoice?.BuyerReference || null,
          tax_registration: typeof companyID === 'string' ? companyID : companyID?.["#text"] || null,
          vat_id: typeof companyID === 'string' ? companyID : companyID?.["#text"] || null
        };

      } else if (format_type === "CII") {
        const buyerParty = xml?.CrossIndustryInvoice
          ?.SupplyChainTradeTransaction
          ?.ApplicableHeaderTradeAgreement
          ?.BuyerTradeParty;

        if (!buyerParty) return callback(new Error("BuyerTradeParty (CII) nicht gefunden"));

        // Buyer Reference extrahieren
        const rawBuyerRef = xml?.CrossIndustryInvoice
          ?.SupplyChainTradeTransaction
          ?.ApplicableHeaderTradeAgreement
          ?.BuyerReference;

        let buyer_reference = null;
        if (typeof rawBuyerRef === "string") {
          buyer_reference = rawBuyerRef;
        } else if (typeof rawBuyerRef === "object" && rawBuyerRef["#text"]) {
          buyer_reference = rawBuyerRef["#text"];
        }

        // Steuer-ID und VAT-ID unterscheiden
        let tax_registration = null;
        let vat_id = null;
        const taxRegs = buyerParty?.SpecifiedTaxRegistration;

        if (Array.isArray(taxRegs)) {
          for (const reg of taxRegs) {
            if (reg?.ID?.["@_schemeID"] === "VA") {
              vat_id = reg.ID?.["#text"] || reg.ID;
            } else {
              tax_registration = reg.ID?.["#text"] || reg.ID;
            }
          }
        } else if (typeof taxRegs === "object" && taxRegs?.ID) {
          if (taxRegs.ID?.["@_schemeID"] === "VA") {
            vat_id = taxRegs.ID?.["#text"] || taxRegs.ID;
          } else {
            tax_registration = taxRegs.ID?.["#text"] || taxRegs.ID;
          }
        }

        buyerData = {
          name: buyerParty?.Name || null,
          address: `${buyerParty?.PostalTradeAddress?.LineOne || ""}, ${buyerParty?.PostalTradeAddress?.PostcodeCode || ""} ${buyerParty?.PostalTradeAddress?.CityName || ""}`.trim(),
          buyer_reference,
          tax_registration,
          vat_id
        };

      } else {
        return callback(new Error("Unbekanntes Format"));
      }

      insertBuyer(buyerData, (err, buyerId) => {
        if (err) return callback(err);
        callback(null, buyerId);
      });

    } catch (err) {
      callback(err);
    }
  });
}

module.exports = { processBuyerFromRawInvoiceId };
