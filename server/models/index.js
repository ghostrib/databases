var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) { }, // a function which produces all the messages
    post: function (params, callback) { } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) { },
    post: function (params, callback) { }
  }
};

