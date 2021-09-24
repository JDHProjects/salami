const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "stats",
  description: "Gives command stats from largest to smallest, defaults to top 3",
  usage: "add user mention as an arg to get stats for that user. add arg \"full\" to get full stats",
  example: "@Salami",
  tested: false,
  execute: async function(message, args) {
    const { commandStats } = require("../db/db.js")
    const { client } = require("../index.js")

    let user = message.author
    if (message.mentions.users.size > 0){
      user = message.mentions.users.first()
    }

    let commandArray = []
    let valueArray = []

    let buildMsg=""
    let stats = await commandStats.findAll({where: {user_id: user.id}})
    stats.forEach(stat => {
      if(client.commands.has(stat.dataValues.command_name)){
        commandArray.push(stat.dataValues.command_name)
        valueArray.push(stat.dataValues.count)
      }
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
    return await sendMessage.send(message, buildMsg)
  },
}