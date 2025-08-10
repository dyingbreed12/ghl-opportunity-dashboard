// database/sqlite.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
    return;
  }

  console.log('Connected to SQLite database');

  db.run(`
    CREATE TABLE IF NOT EXISTS Opportunities (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      OpportunityId TEXT,
      CompensationType TEXT DEFAULT '',
      PropertyAddress TEXT DEFAULT '',
      PropertyType TEXT DEFAULT '',
      DealType TEXT DEFAULT '',
      AskingPrice REAL DEFAULT 0,
      AssignmentFee REAL DEFAULT 0,
      ContractedPrice REAL DEFAULT 0,
      JVShare TEXT DEFAULT '',
      OptionPeriodExpiration TEXT,
      ClosingDate TEXT,
      Access TEXT DEFAULT '',
      LockboxCode TEXT DEFAULT '',
      ShowingTime TEXT DEFAULT '',
      Quality TEXT DEFAULT '',
      MarketingLink TEXT DEFAULT '',
      PicturesLink TEXT DEFAULT '',
      Wholesaler TEXT DEFAULT '',
      Notes TEXT DEFAULT ''
    )
  `, (err) => {
    if (err) console.error('Create table error:', err.message);
    else console.log('Table Opportunities is ready');
  });
});

module.exports = db;
