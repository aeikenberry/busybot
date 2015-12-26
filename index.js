var express = require('express');
var app = express();
var bodyParser = require('bodyParser');
var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL);
var bot = require('./bot.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/slack/receive', function(request, response) {
  /*
  token=gIkuvaNzQIHg97ATvDxqgjtO
  team_id=T0001
  team_domain=example
  channel_id=C2147483705
  channel_name=test
  user_id=U2147483697
  user_name=Steve
  command=/weather
  text=94070
  response_url=https://hooks.slack.com/commands/1234/5678
  */

  bot.updateUserStatus(request.body.user_name, request.body.text);

  bot.getAllStatuses(function(all) {
    return response.json({
      text: all
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
