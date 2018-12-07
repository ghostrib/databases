var models = require('../models');
var mysql = require('mysql');
var dbConnection = require('../db/index.js')
var request = require('request');


module.exports.messages = {
  get: function (req, res) {
    dbConnection.query('SELECT * FROM messages', function (error, rows, fields) {
      if (error) {
        console.log('error getting messages from db');
      } else {
        let messageTable = rows;
        dbConnection.query(`SELECT * FROM users`, function (error, rows, fields) {
          if (error) {
            console.log('error getting users from db');
          } else {
            let userTable = rows;
            dbConnection.query(`SELECT * FROM chatroom`, function (error, rows, fields) {
              if (error) {
                console.log('error getting chatrooms from db');
              } else {
                let roomsTable = rows;
                let formattedMessages = messageFormatter(messageTable, userTable, roomsTable)
                res.end(JSON.stringify(formattedMessages))
              }
            })
          }
        })
      }
    })
  },

  post: function (req, res) {
    let username = req.body.username;
    let msg = req.body.message;
    let roomname = req.body.roomname;
    let created_at = '1988-09-22' //new Date();

    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: username }
    }, function () {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/chatrooms',
        json: { roomname: roomname }
      }, function () {
        let queryString = `SELECT roomID FROM chatroom WHERE room = "${roomname}";`
        dbConnection.query(queryString, function (error, row, field) {
          if (error) {
            console.log('error in trying to recieve chatroom Id')
          } else {
            let roomID = row[0].roomID;
            queryString = `SELECT userID FROM users WHERE username = "${username}";`
            dbConnection.query(queryString, function (error, row, field) {
              if (error) {
                console.log('error in trying to recieve user Id')
              } else {
                let userID = row[0].userID;
                queryString = `INSERT INTO messages (roomID, userID, msg, created_at) VALUES (${roomID}, ${userID}, "${msg}", "${created_at}");`
                dbConnection.query(queryString, function (err, row, field) {
                  if (err) {
                    console.log('error with message post request');
                  } else {
                    console.log('message post request successful')
                    res.end();
                  }
                })
              }
            })
          }
        })
      })
    })
  }
}

module.exports.users = {
  get: function (req, res) {
    dbConnection.query('SELECT * FROM users', function (err, result) {
      if (err) {
        console.log('error during user GET request');
      } else {
        console.log('success during user GET request');
        console.log('result:', result)
        res(null, null, result)
      }
    })
  },

  post: function (req, res) {
    var username = req.body.username;
    var queryString = `INSERT IGNORE INTO users (username) VALUES ('${username}');`
    dbConnection.query(queryString, function (err, results) {
      if (err) {
        console.log('err during db user POST request', err);
        res.end();
      } else {
        console.log('success writing user to db')
        res.end();
      }
    })
  }
}

module.exports.chatrooms = {
  get: function (req, res) {
    dbConnection.query('SELECT * FROM chatroom', function (err, result) {
      if (err) {
        console.log('error during chatroom GET request');
      } else {
        console.log('success during chatroom GET request');
        res(null, null, result)
      }
    })
  },

  post: function (req, res) {
    var roomname = req.body.roomname;
    var queryString = `INSERT IGNORE INTO chatroom (room) VALUES ('${roomname}');`
    dbConnection.query(queryString, function (err, results) {
      if (err) {
        console.log('err during db chatroom POST request', err);
        res.end();
      } else {
        console.log('success writing chatroom to db')
        res.end();
      }
    })
  }
}


const messageFormatter = (messageTable, userTable, roomsTable) => {
  messageTable.forEach((message) => {

    roomsTable.forEach((room) => {
      if (message.roomID === room.roomID) {
        message.roomname = room.room;
      }
    });
    userTable.forEach((user) => {
      if (message.userID === user.userID) {
        message.username = user.username;
      }
    });
  });
  return messageTable
}


