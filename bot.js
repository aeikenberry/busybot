var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL);
var scan = require('redisscan');

module.exports = {
  updateUserStatus: function(username, text, cb) {
    var key = 'user_status:' + username;
    console.log('setting ', key, text);
    client.set(key, text, cb);
  },

  getAllStatuses: function(callback) {
    var returnText = 'Here\'s the latest Availability: \n\n';

    scan({
      redis: client,
      pattern: 'user_status:*',
      each_callback: function (type, key, subkey, value, cb) {
        console.log(type, key, subkey, value);
        var username = key.split('user_status:')[1];
        returnText += username + ': ' + value;
        cb();
      },
      done_callback: function (err) {
          return callback(returnText);
      }
    });
  }
};
