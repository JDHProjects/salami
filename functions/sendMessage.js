require('dotenv').config();

const sendMessage = function(message, text, options={}, type="normal"){
  if(process.env.TEST != "TRUE"){
    if (type == "reply") {
      message.reply(text, options)
    }
    else if (type == "author"){
      message.author.send(text, options)
    }
    else {
      message.channel.send(text, options)
    }
  }
  return[text, options]
}

module.exports = { sendMessage }