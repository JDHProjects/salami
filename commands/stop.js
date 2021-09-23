const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "stop",
  description: "Salami has some sass",
  usage: "Just send stop, theres really not much to this",
  example: "",
  tested: true,
  execute: async function(message, args) {
    return await sendMessage.send(message, "Don't tell me what to do")
  },
}