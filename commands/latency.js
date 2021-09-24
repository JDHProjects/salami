const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "latency",
  description: "time taken for the bot to see a message and deliver its response to it",
  usage: "just call latency",
  cooldown: 1,
  example: "latency",
  tested: false,
  execute: async function(message, args) {
    let respMessage = await sendMessage.send(message, "Latency check!")
    let messageTime = respMessage.createdTimestamp - message.createdTimestamp
    await sendMessage.edit(respMessage, "Response Latency: " + messageTime)
    return
  }
}