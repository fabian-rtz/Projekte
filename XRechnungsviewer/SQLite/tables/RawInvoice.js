const db = require("../db"); //  zentrale DB-Verbindung nutzen


//  Neue RawInvoice einfügen
function insertRawInvoice(data, callback) {
  const query = `
    INSERT INTO RawInvoice (
      raw_xml,
      original_filename,
      upload_date,
      validation_status,
      format_type
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    data.raw_xml,
    data.original_filename,
    data.upload_date,
    data.validation_status,
    data.format_type
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Fehler beim Einfügen der RawInvoice:", err.message);
      return callback(err);
    }

    console.log("RawInvoice erfolgreich eingefügt mit ID:", this.lastID);
    callback(null, this.lastID); // lastID = ID der eingefügten Zeile
  });
}

//  Exportieren
module.exports = {
  insertRawInvoice
};
