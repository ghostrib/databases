var models = require('../models');
var mysql = require('mysql');
var dbConnection = require('../db/index.js')


module.exports = {
  messages: {
    get: function (req, res) { }, // a function which handles a get request for all messages
    post: function (req, res) { } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) { },
    post: function (req, res) {
      var username = req.body.username;
      var queryString = `INSERT INTO users (username) VALUES ('${username}');`
      dbConnection.query(queryString, function (err, results) {
        if (err) {
          console.log('err during db user POST request', err);
        } else {
          console.log('success writing user to db')
          res.end();
        }
      })
    }
  }
};

