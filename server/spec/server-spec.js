/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function () {
  var dbConnection;

  beforeEach(function (done) {
    dbConnection = mysql.createConnection({
      user: 'student',
      password: 'student',
      database: 'chat'
    });
    dbConnection.connect(function (error) {
      if (error) {
        console.log('error connecting to db');
      } else {
        console.log('success connected to db');
      }
    });

    dbConnection.query('SET FOREIGN_KEY_CHECKS = 0;', function (error, results) {
      var tablename = ['users', 'chatroom', 'messages']; // TODO: fill this out
      tablename.forEach(function (table) {
        dbConnection.query('truncate ' + table, function (err, result) {
          if (err) {
            console.log('error clearing db')
          } else {
            if (table === 'messages') {
              console.log('successfully cleared db');
              dbConnection.query('SET FOREIGN_KEY_CHECKS = 1;', done);
              //done();
            }
          }
        });
      });

      /* Empty the db table before each test so that multiple tests
       * (or repeated runs of the tests) won't screw each other up: */
      //dbConnection.query('truncate ' + tablename, done);
    });
  });

  afterEach(function () {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function (done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      console.log('Inside message POST request')
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          message: 'In mercy\'s name, three days is all I need.', //deleted escaped qote
          roomname: 'Hello'
        }
      }, function () {
        console.log('POST requests complete, checking db for data')
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM mesages';  // WAS MESSAGES!!!!
        var queryArgs = [];
        dbConnection.query(queryString, queryArgs, function (err, results) {
          // Should have one result:
          console.log('test query result: ', results)
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].msg).to.equal('In mercy\'s name, three days is all I need.'); //removed escaped quote
          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function (done) {
    // Let's insert a message into the db
    let created_at = '1988-09-22'; //new Date();
    let msg = 'This is a drill, this is only a drill';
    var queryString = `INSERT INTO messages (roomID, userID, msg, created_at) 
                      VALUES (0, 0, "${msg}", "${created_at}");`

    var queryArgs = [];
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, queryArgs, function (err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
        console.log('body', body)
        var messageLog = JSON.parse(body);
        expect(messageLog[0].msg).to.equal('This is a drill, this is only a drill');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });
    });
  });
});
