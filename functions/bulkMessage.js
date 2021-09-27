const Discord = require("discord.js")
const channelMessage = new Discord.Collection()

const { sendMessage } = require("../functions/sendMessage.js")

const bulkReply = function(message, messageText) {
  let replyText = `<@${message.author.id}>, ` + messageText
  return bulkSend(message, replyText)
}

const bulkSend = function(message, messageText) {
  if(process.env.TEST != "TRUE"){
    if (!channelMessage.has(message.channel)) {
      message.channel.sendTyping()
      channelMessage.set(message.channel, messageText)
      setTimeout(() => {
        sendMessage.splitSend(message, channelMessage.get(message.channel))
        channelMessage.delete(message.channel)
      }, 1000)
    }
    else{
      channelMessage.set(message.channel, channelMessage.get(message.channel) + "\n" + messageText)
    }
    return "message queued"
  }
  return [messageText, {}]
}

module.exports = { bulkReply, bulkSend }
