const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  display: "Heist",
  name: "heist",
  description: "try and perform a bank heist, the setup cost is 1k though",
  usage: "just send heist, theres really not much to this",
  cooldown: 30,
  example: "",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    let messageText = ""

    let user = await bankAccounts.findByPk(message.author.id)
    if (user.dataValues.money >= 1000){
      lossWithTax(user, 1000)
      if (Math.floor(Math.random() * 3) != 0) {
        let total = Math.floor(Math.random() * 100)
        let winnings = 0
        if (total < 1){
          winnings = ((Math.random() * 100) + 50)
        }
        else if (total < 5){
          winnings = ((Math.random() * 20) + 10)
        }
        else if (total < 15){
          winnings = ((Math.random() * 5) + 5)
        }
        else if (total < 50){
          winnings = (Math.random() + 1)
        }
        else {
          winnings = ((Math.random() * 0.5) + 0.5)
        }
        let scaledWinnings = Math.floor(winnings * 1000)
        sendFromBank(user, scaledWinnings)
        messageText = await sendMessage.reply(message, `you escaped with ${scaledWinnings} salami!`)

      }
      else {
        messageText = await sendMessage.reply(message, "you were caught!")
      }

    }
    else {
      messageText = await sendMessage.reply(message, "you need 1000 salami to buy the heist equipment!")
    }
    return messageText
  },
}
