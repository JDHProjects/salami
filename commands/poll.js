const { sendMessage } = require("../functions/sendMessage.js")

const questions = ["1️⃣", 
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟"]

module.exports = {
  name: "poll",
  description: "create a poll that users can react to in order to vote",
  usage: "poll create to create a poll (optional extra argument for poll duration in seconds, max 30 minutes)",
  example: "create 120",
  tested: false,
  execute: async function(message, args) {
    if (args[0] != undefined && args[0].toLowerCase() == "create"){
      let msg = ""
      let timeLimit = 60000
      if (args[1] != undefined && !isNaN(parseInt(args[1])) && parseInt(args[1]) <= 1800){
        timeLimit = parseInt(args[1]) * 1000
      }

      let currentMessage = await sendMessage.send(message, "Please input poll title: ")
      let counter = -1
      let collecting = true
      const filter = (m) => m.author.id === message.author.id

      while(collecting){
        try {
          let userReply = (await message.channel.awaitMessages( filter, { max: 1, time: 15000, errors: ["time"] })).first()
          if(userReply.content.toLowerCase() == "done" || counter > 8){
            collecting = false
            currentMessage.delete().catch(_ => {})
            userReply.delete().catch(_ => {})
            if(counter < 0){
              await sendMessage.reply(message, "you need a title and at least one option in your poll")
              return
            }
            msg+="**Choose your answer from the reactions below!**"
            let pollMessage = await sendMessage.send(message, msg)
            await reactResults(pollMessage, timeLimit, counter)
          }
          else {
            currentMessage.delete().catch(_ => {})
            userReply.delete().catch(_ => {})
            if (counter < 0){
              msg += "**"+userReply.content+"**\n\n"
            }
            else {
              msg += questions[counter] + " : " + userReply.content + "\n\n"
            }
            currentMessage = await sendMessage.send(message, "Please input poll option "+(counter+2)+":\n(or \"done\" if finished) ")
            counter++
          }
        }
        catch(err){
          collecting = false
          currentMessage.delete().catch(_ => {})
          sendMessage.reply(message, "timeout!")
        }
      }
    }
    return
  },
}

async function reactResults(message, timeLimit, counter){
  for (let i = 0; i < counter; i++){
    message.react(questions[i])
  }
  const filter = (reaction) => {
    return questions.includes(reaction.emoji.name)
  }

  try{
    await message.awaitReactions(filter, { time: timeLimit + (counter * 250), errors: ["time"] })
  } catch(collected) {
    let maxKey = 0
    let maxValue = 0
    let draw = false
    for (let [key, value] of collected){
      if (value.count > maxValue){
        maxValue = value.count
        maxKey = key
        draw = false
      }
      else if (value.count == maxValue) {
        draw = true
      }
    }
    if (maxValue == 1) {
      message.channel.send("Noone voted :(")
    }
    else if(draw){
      message.channel.send("It's a draw!")
    }
    else {
      message.channel.send("The winner is...\n"+maxKey+" with "+(maxValue-1)+" user votes!")
    }
    return
  }
}