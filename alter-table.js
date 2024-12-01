const connection = require('./db');


const createTableQuery = `
  UPDATE Users
SET Admin_permission = 'yes'
WHERE username = 'Admin';
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
