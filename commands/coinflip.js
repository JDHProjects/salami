const { sendMessage } = require("../functions/sendMessage.js")
const { getButtonRow } = require("../functions/getButtonRow.js")

module.exports = {
  name: "coinflip",
  description: "Flip a coin, guess on the result, you can even bet on the result if you want",
  usage: "requires either \"heads\" or \"tails\", bet by providing a number as an additional arg",
  cooldown: 2,
  example: "heads 100",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    const numToText = ["Heads", "Tails"]
    let messageText = ""
    let user = null

    let amount = 0 
    if (args.length > 0){
      if (!isNaN(parseInt(args[0]))){
        amount = Math.abs(parseInt(args[0]))
      }
    }

    if(amount != 0){
      user = await bankAccounts.findByPk(message.author.id)
      if (amount > user.dataValues.money){
        return await sendMessage.reply(message,"you don't have enough salami to make that bet")
      }
    }

    let userGuess = -1

    const filter = (m) => m.user.id === message.author.id

    let question = await sendMessage.reply(message, "Please select an option", { components: [getButtonRow({ buttons: [{ name:"Heads", id:"heads" },{ name:"Tails", id:"tails" }] })] })

    try {
      let buttonResp = await question.awaitMessageComponent({ filter, time: 5000 })
    
      if (buttonResp.customId === "heads") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow({ disabled:true, buttons: [{ name:"Heads", id:"heads", picked:true },{ name:"Tails", id:"tails" }] })] })
        userGuess = 0
      }
      else if (buttonResp.customId === "tails") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow({ disabled:true, buttons: [{ name:"Heads", id:"heads" },{ name:"Tails", id:"tails", picked:true }] })] })
        userGuess = 1
      }
    } catch {
      return await sendMessage.edit(question, "You forgot to pick an option :(", { components: [getButtonRow({ disabled:true, buttons: [{ name:"Heads", id:"heads" },{ name:"Tails", id:"tails" }] })] })
    }

    
    let flip = Math.floor(Math.random() * 2) 
    if(flip == userGuess){
      messageText = await sendMessage.reply(message,`${numToText[flip]}, you win!`)
      if (amount > 0){
        await sendFromBank(user, amount)
      }
    }
    else{
      messageText = await sendMessage.reply(message,`${numToText[flip]}, you lose`)
      if (amount > 0){
        await lossWithTax(user, amount)
      }
    }
    return messageText
  },
}