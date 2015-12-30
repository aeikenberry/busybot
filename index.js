var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL);
var bot = require('./bot.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/slack/receive', function(request, response) {
  /*
  token=TqO2aXceZ2XQnK4hyN1KvDMX
  team_id=T0001
  team_domain=example
  channel_id=C2147483705
  channel_name=test
  timestamp=1355517523.000005
  user_id=U2147483697
  user_name=Steve
  text=googlebot: What is the air-speed velocity of an unladen swallow?
  trigger_word=googlebot:
  */
  console.log(request.body);
  var text = request.body.text.split(request.body.trigger_word)[1].trim();


  bot.updateUserStatus(request.body.user_name, text);
  bot.getAllStatuses(function(fields) {
    bot.postStatusUpdate(fields);
  });

  return response.json({
    text: "Status updated."
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
