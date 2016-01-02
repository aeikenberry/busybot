var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bot = require('./bot.js');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/slack/receive', function(request, response) {
  bot.updateUserStatus(request.body.user_name, request.body.user_id, request.body.text);
  bot.getAllStatuses(function(fields) {
    bot.postStatusUpdate(fields, function() {
      return response.json({
        text: "Status updated."
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
