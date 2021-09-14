const CronJob = require('cron').CronJob;
var ping = require('ping');
require('dotenv').config();

const { upOrDown } = require('../db/functions/upOrDown.js')

const downDetector = function() {
  if(process.env.DOWN_DETECTION == "TRUE"){
    job.start();
    console.log("Down detection started")
  }
}

const job = new CronJob('0 * * * * *', function() {
    ping.promise.probe("8.8.8.8")
    .then(function (res) {
        upOrDown(res.alive ? "true" : "false")
        .then(resp => {
            if (resp != 0) {
                const { client } = require('../index.js')
                client.users.fetch(process.env.OWNER, false).then((admin) => {
                    admin.send(`Salami was down for: ${Math.round(resp/5)*5} seconds`);
                });
            }
        })
    })
});

module.exports = { downDetector }