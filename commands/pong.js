const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "pong",
  description: "You've got this all backwards",
  usage: "Just send pong, theres really not much to this",
  example: "",
  tested: true,
  execute: async function(message, args) {
    return await sendMessage.send(message, "Wrong way round idiot!")
  },
}