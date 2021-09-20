const fs = require("fs")
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

module.exports = {
  name: "stats",
  description: "Gives command stats from largest to smallest, defaults to top 3",
  usage: "add user mention as an arg to get stats for that user. add arg \"full\" to get full stats",
  example: "@Salami",
  execute(message, args) {
    const { commandStats } = require("../db/db.js")
    let user = user = message.author
    if (message.mentions.users.size > 0){
      user = message.mentions.users.first()
    }

    let commandArray = []
    let valueArray = []
    for (const file of commandFiles) {
      commandArray.push(require(`../commands/${file}`).name)
      valueArray.push(0)
    }

    let buildMsg=""
    commandStats.findAll({where: {user_id: user.id}})
      .then(stats => {
        stats.forEach(stat => {
          valueArray[commandArray.indexOf(stat.dataValues.command_name)] = stat.dataValues.count
        })
        if (stats === []){
          buildMsg="You haven't used the bot yet!"
        }
        else{
          let commentCount = 3
          if (commandArray.length < 3){
            commentCount = commandArray.length
          }
          for (let i in args){
            if (args[i] == "full"){
              commentCount = commandArray.length
            }
          }
          buildMsg+=`Stats for <@${user.id}>\n`
        
          for (let added = 0; added < commentCount; added++) {
            let maxIndex = valueArray.indexOf(Math.max(...valueArray))
            buildMsg+=commandArray[maxIndex] + ": " + valueArray[maxIndex]+"\n"
            valueArray[maxIndex] = -1
          }
        }
        message.channel.send(buildMsg)
      })
  },
}