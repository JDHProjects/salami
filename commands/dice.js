const { sendMessage } = require("../functions/sendMessage.js")
const { parseAndRollDice } = require("../functions/parseAndRollDice")

module.exports = {
  name: "d",
  description: "Rolls as many dice as required and adds them up for you",
  usage: "2D6 will roll 2xD6 dice, 1D10 will roll 1xD10 dice etc. Modifier can be added at any point with +5 -5 etc. Multiple Dice can be supplied to a single command. Can roll up to 100 dice with a value up to 1 million",
  example: "4D6 2D20+5 1D10-2 +10",
  execute(message, args) {
    let msg = parseAndRollDice(args.join(" "))[0]
    let messageText = sendMessage.send(message, msg, { split: true })
    return messageText
  },
}