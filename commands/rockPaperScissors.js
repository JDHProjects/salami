const { MessageActionRow, MessageButton } = require("discord.js")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "rps",
  description: "play rock, paper, scissors against the bot, bet by providing an argument",
  usage: "just send rps, add a number to bet on the result",
  example: "100",
  tested: false,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    const rps = ["rock", "Paper", "Scissors"]
    const winTable = [[2,1], [0,2], [1,0]]

    let messageText = {}

    let amount = 0 
    if (args.length > 0){
      if (!isNaN(parseInt(args[0]))){
        amount = Math.abs(parseInt(args[0]))
      }
    }

    let userGuess = -1

    const filter = (m) => m.user.id === message.author.id

    let question = await sendMessage.send(message, "Please select an option", { components: [getButtonRow()] })

    try {
      let buttonResp = await question.awaitMessageComponent({ filter, time: 5000 })
    
      if (buttonResp.customId === "rock") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow("rock")] })
        userGuess = 0
      }
      if (buttonResp.customId === "paper") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow("paper")] })
        userGuess = 1
      }
      if (buttonResp.customId === "scissors") {
        await buttonResp.update({ content: "Selection made!", components: [getButtonRow("scissors")] })
        userGuess = 2
      }
    } catch {
      return await sendMessage.edit(question, "You forgot to pick an option :(", { components: [getButtonRow("none")] })
    }

    let user = await bankAccounts.findByPk(message.author.id)
    if (amount <= user.dataValues.money){
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
    }
    else {
      return await sendMessage.reply(message,"you don't have enough salami to make that bet")
    }
  },
}

const getButtonRow = function(pick=null){
  let row = new MessageActionRow()
  let rock = new MessageButton()
    .setCustomId("rock")
    .setLabel("Rock")
    .setDisabled(pick!=null)
  if (pick == "rock"){
    rock.setStyle("SUCCESS")
  }
  else if (pick!=null) {
    rock.setStyle("SECONDARY")
  }
  else {
    rock.setStyle("PRIMARY")
  }
  let paper = new MessageButton()
    .setCustomId("paper")
    .setLabel("Paper")
    .setDisabled(pick!=null)
  if (pick == "paper"){
    paper.setStyle("SUCCESS")
  }
  else if (pick!=null) {
    paper.setStyle("SECONDARY")
  }
  else {
    paper.setStyle("PRIMARY")
  }
  let scissors =  new MessageButton()
    .setCustomId("scissors")
    .setLabel("Scissors")
    .setDisabled(pick!=null)
  if (pick == "scissors"){
    scissors.setStyle("SUCCESS")
  }
  else if (pick!=null) {
    scissors.setStyle("SECONDARY")
  }
  else {
    scissors.setStyle("PRIMARY")
  }
  return row.addComponents(rock, paper, scissors)
}
