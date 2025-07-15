const sqlite3 = require("sqlite3").verbose();

// 🔌 Verbindung erstellen
const db = new sqlite3.Database("datenbank.db");

// ✅ Foreign Keys aktivieren
db.run("PRAGMA foreign_keys = ON;");

db.serialize(() => {
  // Tabelle: ValidationLog
  db.run(`
    CREATE TABLE IF NOT EXISTS ValidationLog (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      rawinvoice_id INTEGER,
      validated_at TEXT,
      validation_time TEXT,
      error_details TEXT,
      raw_output TEXT,

      FOREIGN KEY (rawinvoice_id) REFERENCES RawInvoice(rawinvoice_id) ON DELETE SET NULL
    );
  `);

  // Tabelle: RawInvoice
  db.run(`
    CREATE TABLE IF NOT EXISTS RawInvoice (
      rawinvoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_xml TEXT,
      original_filename TEXT,
      upload_date TEXT,
      validation_status TEXT,
      format_type TEXT
    );
  `);

  // Tabelle: Invoice
  db.run(`
    CREATE TABLE IF NOT EXISTS Invoice (
      invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT,
      invoice_type_code TEXT,
      document_type_code TEXT,
      profile TEXT,
      issue_date TEXT,
      delivery_date TEXT,
      due_date TEXT,
      included_note TEXT,
      total_net_amount REAL,
      total_tax_amount REAL,
      grand_total_amount REAL,
      rawinvoice_id INTEGER,
      buyer_id INTEGER,
      supplier_id INTEGER,

      FOREIGN KEY (buyer_id) REFERENCES Buyer(buyer_id) ON DELETE CASCADE,
      FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE CASCADE, 
      FOREIGN KEY (rawinvoice_id) REFERENCES RawInvoice(rawinvoice_id) ON DELETE CASCADE
    );
  `);

  // Tabelle: Buyer
  db.run(`
    CREATE TABLE IF NOT EXISTS Buyer (
      buyer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      buyer_reference TEXT,
      tax_registration TEXT,
      vat_id TEXT
    );
  `);

  // Tabelle: Supplier
  db.run(`
    CREATE TABLE IF NOT EXISTS Supplier (
      supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      contact TEXT,
      tax_registration TEXT,
      vat_id TEXT
     
    );
  `);

  // Tabelle: PaymentInfo
  db.run(`
    CREATE TABLE IF NOT EXISTS PaymentInfo (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      payment_type_code INTEGER,
      IBAN TEXT,
      BIC TEXT,
      payment_terms TEXT,
      skonto_percent REAL,
      skonto_days INTEGER,
      FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id) ON DELETE CASCADE
    );
  `);

  // Tabelle: InvoiceItem
  db.run(`
    CREATE TABLE IF NOT EXISTS InvoiceItem (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      line_no INTEGER,
      product_name TEXT,
      description TEXT,
      quantity REAL,
      unit_price REAL,
      unit_code TEXT,
      line_total REAL,
      tax_rate REAL,
      line_tax_amount REAL,

      FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id) ON DELETE CASCADE
    );
  `);
});

module.exports = db;