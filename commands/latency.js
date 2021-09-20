module.exports = {
  name: "latency",
  description: "time taken for the bot to see a message and deliver its response to it",
  usage: "just call latency",
  cooldown: 1,
  example: "latency",
  execute(message, args) {
    message.channel.send("Latency check!")
      .then(respMessage => {
        let messageTime = respMessage.createdTimestamp - message.createdTimestamp
        respMessage.edit("Response Latency: " + messageTime).catch(_ => {})
      })
  }
}