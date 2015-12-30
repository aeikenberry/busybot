var redis = require('redis');
var request = require('request');
var client = redis.createClient(process.env.REDIS_URL);
var scan = require('redisscan');

var CHANNEL = process.env.CHANNEL;
var INCOMING_URL = process.env.INCOMING_WEBHOOK_URL;
var slack = require('slack-notify')(INCOMING_URL);

module.exports = {
  updateUserStatus: function(username, text) {
    var key = 'user_status:' + username;
    console.log('setting ', key, text);
    client.set(key, text, redis.print);
  },

  getAllStatuses: function(callback) {
    var fields = [];

    scan({
      redis: client,
      pattern: 'user_status:*',
      each_callback: function (type, key, subkey, other, value, cb) {
        var username = key.split('user_status:')[1];

        fields.push({
          "title": username,
          "value": value,
          "short": false
        });
        cb();
      },
      done_callback: function (err) {
          return callback(fields);
      }
    });
  },

  postStatusUpdate: function(fields, cb) {
    slack.send({
      channel: CHANNEL,
      text: "Availability updated.",
      username: 'Availability Robot',
      attachments: [{
        fallback: 'Availability updated.',
        fields: fields
      }]
    }, cb);

    slack.onError = function (err) {
      console.log('API error:', err);
    };
  }
};
