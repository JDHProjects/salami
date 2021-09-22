const Discord = require("discord.js")
const channelMessage = new Discord.Collection()

const bulkReply = function(message, messageText) {
  let replyText = `<@${message.author.id}>, ` + messageText
  return bulkSend(message, replyText)
}

const bulkSend = function(message, messageText) {
  if(process.env.TEST != "TRUE"){
    if (!channelMessage.has(message.channel)) {
      message.channel.startTyping()
      channelMessage.set(message.channel, messageText)
      setTimeout(() => {
        message.channel.stopTyping()
        message.channel.send(channelMessage.get(message.channel), { split: true })
        channelMessage.delete(message.channel)
      }, 1000)
    }
    else{
      channelMessage.set(message.channel, channelMessage.get(message.channel) + "\n" + messageText)
    }
    return "message queued"
  }
  return [messageText, { split: true }]
}

module.exports = { bulkReply, bulkSend }
