const mysql = require('mysql2');

// Create a connection to the AWS RDS MySQL database
const connection = mysql.createConnection({
  host: 'hotel-reservation-system.cn4oo24osytm.eu-north-1.rds.amazonaws.com', // Replace with your RDS endpoint
  user: 'admin',          // Your RDS username
  password: '12345678', // Your RDS password
  database: 'hrs' // The name of the database you want to use
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the database with thread ID: ' + connection.threadId);
});

module.exports = connection;
