const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "serverstats",
  description: "Gives top commands usage from largest to smallest, defaults to top 3",
  usage: "add command name as an arg to get top three users for that command. add arg \"full\" to get full user list",
  example: "ping",
  tested: false,
  execute: async function(message, args) {
    const { commandStats } = require("../db/db.js")
    const { client } = require("../index.js")
    
    let commandArray = []
    let countArray = []
    client.commands.forEach(command => {
      commandArray.push(command.name)
      countArray.push(0)
    })

    let buildMsg=""

    let full = false
    let command = null
    for (let i in args){
      if (args[i] == "full"){
        full = true
      }
      else if (commandArray.includes(args[i])){
        command = args[i]
      }
    }

    let options = {}
    if (command != null){
      options.where = {command_name: command}
      options.order = [["count", "DESC"]]
    }


    let stats = await commandStats.findAll(options)
    stats.forEach(stat => {
      countArray[commandArray.indexOf(stat.dataValues.command_name)] += stat.dataValues.count
    })
    let statsCount = 3
    if (stats.length < 3){
      statsCount = stats.length
    }
    let total = 0
    if(command != null){
      buildMsg+=`**Leaderboard for ${command}**\n`
      for (let x = 0; x < (full ? stats.length : statsCount); x++) {
        buildMsg+=`${parseInt(x)+1}) <@${stats[x].dataValues.user_id}> : ${stats[x].dataValues.count}\n`
      }
      total = countArray[commandArray.indexOf(command)]
    }
    else{
      buildMsg+="**Top used commands**\n"
      total = countArray.reduce((a, b) => a + b, 0)
      for (let x = 0; x < (full ? commandArray.length : statsCount); x++) {
        let maxIndex = countArray.indexOf(Math.max(...countArray))
        buildMsg+=`${parseInt(x)+1}) ${commandArray[maxIndex]} : ${countArray[maxIndex]}\n`
        countArray[maxIndex] = -1
      }
    }
    if(full){
      buildMsg+=`**Total times used: ${total}**\n`
    }
    return await sendMessage.send(message, buildMsg)
  },
}