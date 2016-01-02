# Slack Busy Bot

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Server
### Make this Node app publicly accessible.
### Get a publicly-accessible Redis Instance
### Set Config/Env Vars

- PORT (Heroku will set for you, or set manually)
- INCOMING_WEBHOOK_URL
- CHANNEL
- REDIS_URL
- GREEN_ICON
- YELLOW_ICON
- RED_ICON
- BLACK_ICON

## Slack Config

- Create a new slash command, whatever you want ie `/busy`
  - Set the url to `http://yourdomain.biz/slack/receive`

- Create an incoming webhook
  - note the url created, set it as your INCOMING_WEBHOOK_URL

## Usage

![Setting your availibility](https://dl.dropboxusercontent.com/u/12840891/Screen%20Shot%202015-12-30%20at%207.34.37%20PM.png)

![Prints to your selected channel] (https://dl.dropboxusercontent.com/u/12840891/Screen%20Shot%202015-12-30%20at%207.34.56%20PM.png)

Bonus:
If you want to ping people who've set statuses but don't have one from today,
schedule ping.js to run daily.
