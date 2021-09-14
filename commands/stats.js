const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = {
    name: 'stats',
    description: 'Gives command stats from largest to smallest, defaults to top 3',
    usage: 'add user mention as an arg to get stats for that user. add arg "full" to get full stats',
    example: '@Salami',
	execute(message, args) {
    const { commandStats } = require('../db/db.js')

    if (message.mentions.users.size > 0){
      user = message.mentions.users.first()
    }
    else{
      user = message.author
    }

    commandArray = []
    valueArray = []
    for (const file of commandFiles) {
      commandArray.push(require(`../commands/${file}`).name)
      valueArray.push(0)
    }

    buildMsg=""
    commandStats.findAll({where: {user_id: user.id}})
    .then(stats => {
      stats.forEach(stat => {
        valueArray[commandArray.indexOf(stat.dataValues.command_name)] = stat.dataValues.count
      });
      if (stats === []){
        buildMsg="You haven't used the bot yet!"
      }
      else{
        if (commandArray.length < 3){
          commentCount = commandArray.length
        }
        else{
          commentCount = 3
        }
        for (i in args){
          if (args[i] == "full"){
            commentCount = commandArray.length
          }
        }
        buildMsg+=`Stats for <@${user.id}>\n`
        
        for (added = 0; added < commentCount; added++) {
          let maxIndex = valueArray.indexOf(Math.max(...valueArray))
          buildMsg+=commandArray[maxIndex] + ": " + valueArray[maxIndex]+"\n"
          valueArray[maxIndex] = -1
        }
      }
      message.channel.send(buildMsg)
    })
	},
};