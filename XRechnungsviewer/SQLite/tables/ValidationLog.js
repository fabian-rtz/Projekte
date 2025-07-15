const db = require("../db");

function insertValidationLog(log, callback) {
  const query = `
    INSERT INTO ValidationLog (
      rawinvoice_id,
      validated_at,
      validation_time,
      error_details,
      raw_output
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    log.rawinvoice_id,
    log.validated_at,
    log.validation_time,
    log.error_details,
    log.raw_output
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error(" Fehler beim Einfügen in ValidationLog:", err.message);
      return callback(err);
    }

    console.log(" ValidationLog erfolgreich gespeichert mit ID:", this.lastID);
    callback(null, this.lastID);
  });
}

module.exports = {
  insertValidationLog
};
