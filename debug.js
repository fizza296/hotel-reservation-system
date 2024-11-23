const db = require('./db');

db.query('SELECT 1 + 1 AS result')
  .then(([rows]) => {
    console.log('Database connection successful:', rows);
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });
