require('dotenv').config();

const sendMessage = {
  send(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      message.channel.send(text, options)
    }
    return[text, options]
  },
  reply(message, text, options={}){
    console.log("hello")
    if(process.env.TEST != "TRUE"){
      message.reply(text, options)
    }
    return[text, options]
  },
  author(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      message.author.send(text, options)
    }
    return[text, options]
  },
}

module.exports = { sendMessage }