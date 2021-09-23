const { wild_values } = require("../assets/wildSurge/table.json")
const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "wildsurge",
  description: "Gives a random wild surge (1 of 10,000). Data from https://github.com/haa-gg/Improbability-Drive",
  usage: "Just send wildsurge, theres really not much to this",
  example: "",
  tested: true,
  execute: async function(message, args) {
    let randInt = Math.floor((Math.random() * wild_values.length))
    message.delete().catch(_ => {})
    return await sendMessage.reply(message, `you rolled ${randInt}: ${wild_values[randInt]}`)
  },
}