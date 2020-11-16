
module.exports = {
    name: 'stats',
    description: 'Gives command stats from largest to smallest, defaults to top 3',
    usage: 'add user mention as an arg to get stats for that user. add arg "full" to get full stats',
    example: '@Salami',
	execute(message, args) {
    const { commandStats } = require('../db/dbSetup.js')

    if (message.mentions.users.size > 0){
      user = message.mentions.users.first()
    }
    else{
      user = message.author
    }

    buildMsg=""
    commandStats.findAll({where: {user_id: user.id}})
    .then(stats => {
      console.log(stats)
      let commandArray = []
      let valueArray = []
      stats.forEach(stat => {
        commandArray.push(stat.dataValues.command_name)
        valueArray.push(stat.dataValues.count)
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