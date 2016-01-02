var bot = require('./bot.js');
var _ = require('lodash');


bot.getAllStatuses(function(fields) {
  var usersWithStatus = fields.map(function(field) { return field.title; });

  bot.getUserNames(function(allUsers) {
    var missingUsers = _.difference(allUsers, usersWithStatus);
    missingUsers.forEach(function(username) {
      bot.sendAvailabilityReminder(username);
    });
  });
});
