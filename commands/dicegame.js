const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "dicegame",
  description: "Roll a dice, guess on the result, you can even bet on the result if you want",
  usage: "requires from \"one\" to \"six\" in words, bet by providing a number as an additional arg",
  cooldown: 2,
  example: "\"one\" 100",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    let messageText = ""
			
    const wordsToNum={
      one:1,
      two:2,
      three:3,
      four:4,
      five:5,
      six:6
    }
    const numToWords={
      1:"one",
      2:"two",
      3:"three",
      4:"four",
      5:"five",
      6:"six"
    }

    let amount = 0
    let guess = -1
    for (let i in args){
      if(wordsToNum[args[i]] != undefined){
        guess=wordsToNum[args[i]]
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = Math.abs(parseInt(args[i]))
      }
    }

    if(guess != -1){
      let user = await bankAccounts.findByPk(message.author.id)
      if (amount <= user.dataValues.money){
        let result = Math.floor(Math.random() * 6) + 1 
        if(result == guess){
          messageText = sendMessage.send(message, `${numToWords[result]}! <@${message.author.id}>, you win!`)
          sendFromBank(user, amount*5)
        }
        else{
          messageText = sendMessage.send(message, `${numToWords[result]}! <@${message.author.id}>, you lose`)
          lossWithTax(user, amount)
        }
      }
      else{
        messageText = sendMessage.reply(message, "you don't have enough salami to make that bet")
      }
    }
    else{
      messageText = sendMessage.reply(message, "you forgot to make a guess!")
    }
    return(messageText)
  },
}