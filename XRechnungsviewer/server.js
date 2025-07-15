const express = require("express");
const multer = require("multer");
const path = require("path");


//  Datenbank initialisieren (Tabellen werden beim Laden erstellt)
require("./SQLite/db");

//  Multer für Datei-Uploads
const upload = multer({ dest: "uploads/" });

//  App starten
const app = express();
const PORT = 3000;
const STATIC_DIR = path.resolve("public");

//  Routen & Validierung auslagern
require("./routes/validationRoutes")(app, upload, STATIC_DIR);

//  Server starten
app.listen(PORT, () => {
  console.log(` Server läuft unter http://localhost:${PORT}`);
});
