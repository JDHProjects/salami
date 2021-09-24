const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "ping",
  description: "A simple ping pong",
  usage: "Just send ping, theres really not much to this",
  example: "",
  tested: true,
  execute: async function(message, args) {
    return await sendMessage.send(message, "Pong!")
  },
}