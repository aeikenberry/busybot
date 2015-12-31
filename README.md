# Slack Busy Bot

## Server
### Make this Node app publicly accessible.
### Get a publicly-accessible Redis Instance
### Set Config/Env Vars

- PORT (Heroku will set for you, or set manually)
- INCOMING_WEBHOOK_URL
- CHANNEL
- REDIS_URL

## Slack Config

- Create a new slash command, whatever you want ie `/busy`
  - Set the url to `http://yourdomain.biz/slack/receive`
  
- Create an incoming webhook
  - note the url created, set it as your INCOMING_WEBHOOK_URL
