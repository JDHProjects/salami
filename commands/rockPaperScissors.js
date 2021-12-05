const { sendMessage } = require("../functions/sendMessage.js")
const { getButtonRow } = require("../functions/getButtonRow.js")

module.exports = {
  display: "Rock Paper Scissors",
  name: "rps",
  description: "play rock, paper, scissors against the bot, bet by providing an argument",
  usage: "just send rps, add a number to bet on the result",
  example: "100",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    const rps = ["rock", "Paper", "Scissors"]
    const winTable = [[2,1], [0,2], [1,0]]

    let messageText = {}
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

    let question = await sendMessage.reply(message, "Please select an option", { components: [getButtonRow({buttons: [{name:"Rock", id:"rock"},{name:"Paper", id:"paper"},{name:"Scissors", id:"scissors"}]})] })

    try {
      let buttonResp = await question.awaitMessageComponent({ filter, time: 5000 })
    
      if (buttonResp.customId === "rock") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow({disabled: true, buttons: [{ name:"Rock", id:"rock", picked:true },{ name:"Paper", id:"paper" },{ name:"Scissors", id:"scissors" }]})] })
        userGuess = 0
      }
      else if (buttonResp.customId === "paper") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow({disabled: true, buttons: [{ name:"Rock", id:"rock" },{ name:"Paper", id:"paper", picked:true },{ name:"Scissors", id:"scissors" }]})] })
        userGuess = 1
      }
      else if (buttonResp.customId === "scissors") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow({disabled: true, buttons: [{ name:"Rock", id:"rock" },{ name:"Paper", id:"paper" },{name:"Scissors", id:"scissors", picked:true }]})] })
        userGuess = 2
      }
    } catch {
      return await sendMessage.edit(question, "You forgot to pick an option :(", { components: [getButtonRow({ disabled: true, buttons: [{ name:"Rock", id:"rock" },{ name:"Paper", id:"paper" },{ name:"Scissors", id:"scissors" }]})] })
    }

    let result = Math.floor(Math.random() * 3)
    if (winTable[result][1] == userGuess){
      messageText = await sendMessage.reply(question, `Salami picked ${rps[result]}, you win!`)
      if (amount > 0){
        sendFromBank(user, amount)
      }
      return messageText
    }
    else if (result == userGuess){
      return await sendMessage.reply(question, `Salami picked ${rps[result]}, you draw!`)
    }
    else {
      messageText = await sendMessage.reply(question, `Salami picked ${rps[result]}, you lose!`)
      if (amount > 0){
        lossWithTax(user, amount)
      }
      return messageText
    }
  },
}
