
module.exports = {
    name: 'stats',
    description: 'Gives command stats from largest to smallest, defaults to top 3',
    usage: 'add user mention as an arg to get stats for that user. add arg "full" to get full stats',
    example: '@Salami',
	execute(message, args) {
    const { commandStats} = require('../db/dbSetup.js')

    if (message.mentions.users.size > 0){
      user = message.mentions.users.first()
    }
    else{
      user = message.author
    }

    buildMsg=""
    commandStats.findByPk(user.id)
    .then(stat => {
      //console.log(stat)
      if (stat === null){
        buildMsg="You haven't used the bot yet!"
      }
      else{
        commentCount = 3
        let commandArray = Object.keys(stat.dataValues).slice(1)
        let valueArray = Object.values(stat.dataValues).slice(1)
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