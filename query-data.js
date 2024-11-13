const connection = require('./db');

// Query data from the 'Hotels' table
const query = 'SELECT * FROM Bookings';

connection.query(query, (err, results) => {
  if (err) {
    console.error('Error querying data: ', err);
  } else {
    console.log('Data fetched successfully:', results);
  }
  // Close the connection
  connection.end();
});
