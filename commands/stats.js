
module.exports = {
    name: 'stats',
    description: 'Gives command stats from largest to smallest, defaults to top 3',
    usage: 'add user mention as an arg to get stats for that user. add arg "full" to get full stats',
    example: '@Salami',
	execute(message, args) {
        const parse = require('csv-parse/lib/sync');
        const fs = require('fs');
        let data = fs.readFileSync('assets/usage-stats/commands-per-user.csv', 'utf8')
        statArray = parse(data, {
            skip_empty_lines: true
        })

        if (message.mentions.users.size > 0){
          user = message.mentions.users.first()
        }
        else{
          user = message.author
        }

        //get user index
        let loc = -1
        for (x in statArray){
            if(statArray[x][0] == user.id){
                loc = x
            }
        }

        buildMsg=""

        if (loc > 0){
          commentCount = statArray[0].length - 1 > 3 ? 3 : statArray[0].length - 1
          for (i in args){
            if (args[i] == "full"){
              commentCount = statArray[0].length - 1
            }
          }

          let userIntArray = statArray[loc].slice(1).map(function (x) { 
            return parseInt(x, 10); 
          });
          
          buildMsg+=`Stats for <@${user.id}>\n`

          for (added = 0; added < commentCount; added++) {
            let maxIndex = userIntArray.indexOf(Math.max(...userIntArray)) + 1
            buildMsg+=statArray[0][maxIndex] + ": " + statArray[loc][maxIndex]+"\n"
            userIntArray[maxIndex-1] = -1
          }
        }
        else {
          buildMsg="You haven't used the bot yet!"
        }
      
       message.channel.send(buildMsg)

	},
};