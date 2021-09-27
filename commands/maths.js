const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "maths",
  description: "solve a basic maths question to make some money",
  usage: "just send maths, then send your response as a normal message",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")
    console.log("hello")

    let operator = Math.floor(Math.random() * 3)
    let operandOne = Math.floor(Math.random() * 20)
    let operandTwo = Math.floor(Math.random() * 20)
    let operatorArray = ["x", "+", "-"]
    let answer = 0
    if(operator == 0){
      answer = operandOne * operandTwo
    }
    else if(operator == 1){
      answer = operandOne + operandTwo
    }
    else if(operator == 2){
      answer = operandOne - operandTwo
    }

    sendMessage.reply(message, `Question: ${operandOne} ${operatorArray[operator]} ${operandTwo}`)

    const filter = (m) => m.author.id === message.author.id
    try{
      let userReply = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
      let userAnswer = parseInt(userReply.first().content)
      if (isNaN(userAnswer)){
        sendMessage.reply(message, "answer not a number")
      }
      else if (userAnswer != answer){
        sendMessage.reply(message, `wrong, the answer was ${answer}`)
      }
      else{
        let winnings = Math.floor(Math.random() * 29) + 1
        let user = await bankAccounts.findByPk(message.author.id)
        sendMessage.reply(message, `correct! You win ${winnings} salami!`)
        sendFromBank(user, winnings)
      }
    }
    catch{
      sendMessage.reply(message, "you forgot to answer!")
    }
    return
  },
}