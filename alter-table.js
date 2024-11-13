const connection = require('./db');

// Create a table named 'users'
const createTableQuery = `
  ALTER TABLE Hotels
ADD COLUMN image_link varchar(255);

`;

connection.query(createTableQuery, (err, results) => {
  if (err) {
    console.error('Error dropping table: ', err);
  } else {
    console.log('Table altered successfully', results);
  }
  // Close the connection
  connection.end();
});
