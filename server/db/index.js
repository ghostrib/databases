var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

let connection = mysql.createConnection({
    user: 'student',
    password: 'student',
    database: 'chat'
});

connection.connect(function (error) {
    if (error) {
        console.log('error', error);
    } else {
        console.log('connection successful');
    }
});

module.exports = connection;