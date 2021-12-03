const { sendMessage } = require("../functions/sendMessage.js")
const { getButtonRow } = require("../functions/getButtonRow.js")

module.exports = {
  name: "dicegame",
  description: "Roll a dice, guess on the result, you can even bet on the result if you want",
  usage: "Bet by providing a number as an arg",
  cooldown: 2,
  example: "100",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    const numToText = ["One", "Two", "Three", "Four", "Five", "Six"]
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

    let question = await sendMessage.reply(message, "Please select an option", { components: [ getButtonRow({ buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })]})

    try {
      let buttonResp = await question.awaitMessageComponent({ filter, time: 5000 })
    
      if (buttonResp.customId === "one") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one", picked:true },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })]})
        userGuess = 0
      }
      else if (buttonResp.customId === "two") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two", picked:true },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })]})
        userGuess = 1
      }
      else if (buttonResp.customId === "three") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three", picked:true }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })]})
        userGuess = 2
      }
      else if (buttonResp.customId === "four") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four", picked:true },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })]})
        userGuess = 3
      }
      else if (buttonResp.customId === "five") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five", picked:true },{ name:"Six", id:"six" }] })]})
        userGuess = 4
      }
      else if (buttonResp.customId === "six") {
        await buttonResp.update({ content: "Selection made!", components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six", picked:true }] })]})
        userGuess = 5
      }
    } catch {
      return await sendMessage.edit(question, "You forgot to pick an option :(", { components: [ getButtonRow({ disabled:true, buttons: [{ name:"One", id:"one" },{ name:"Two", id:"two" },{ name:"Three", id:"three" }]}),getButtonRow({ disabled:true, buttons: [{ name:"Four", id:"four" },{ name:"Five", id:"five" },{ name:"Six", id:"six" }] })] })
    }

    let result = Math.floor(Math.random() * 6)
    if(result == userGuess){
      messageText = await sendMessage.reply(message, `${numToText[result]}! <@${message.author.id}>, you win!`)
      if (amount > 0){
        sendFromBank(user, amount*5)
      }
    }
    else{
      messageText = await sendMessage.reply(message, `${numToText[result]}! <@${message.author.id}>, you lose`)
      if (amount > 0){
        lossWithTax(user, amount)
      }
    }

    return messageText
  },
}