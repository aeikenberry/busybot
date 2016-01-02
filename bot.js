var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL);
var scan = require('redisscan');
var slack = require('slack-notify')(process.env.INCOMING_WEBHOOK_URL);

var CHANNEL = process.env.CHANNEL;
var EIGHT_HOURS_SECONDS = String(60 * 60 * 8);
var USER_STATUS_KEY = 'user_status:';
var TEAM_MEMBERS_KEY = 'team_members:';

var commands = {
  'green': ':green_apple:',
  'yellow': ':yellow_heart:',
  'red': ':red_circle:',
  'black': ':black_circle:'
};

module.exports = {
  updateUserStatus: function(username, userID, text) {
    var status = this.parseStatusText(text);
    var statusKey = USER_STATUS_KEY + username;
    client.setex([statusKey, EIGHT_HOURS_SECONDS, status], redis.print);
    this.addUser(username, userID);
  },

  parseStatusText: function(text) {
    if (!text) return 'BUSY';

    var command = text.split(' ')[0];

    if (commands[command]) {
      return commands[command] + text.substring(text.length - command.length + 1);
    }

    return text;
  },

  addUser: function(username, userID) {
    var teamKey = TEAM_MEMBERS_KEY + userID;
    client.set(teamKey, username, redis.print);
  },

  getUserNames: function(callback) {
    var users = [];

    scan({
      redis: client,
      pattern: TEAM_MEMBERS_KEY + '*',
      each_callback: function (type, key, subkey, other, value, cb) {
        users.push(value);
        cb();
      },
      done_callback: function (err) {
          return callback(users);
      }
    });
  },

  sendAvailabilityReminder: function(username) {
    slack.send({
      channel: '@' + username,
      text: 'What\'s your status? Please tell me!',
      username: "Availability Robot"
    });
  },

  getAllStatuses: function(callback) {
    var fields = [];

    scan({
      redis: client,
      pattern: USER_STATUS_KEY + '*',
      each_callback: function (type, key, subkey, other, value, cb) {
        var username = key.split(USER_STATUS_KEY)[1];

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
