require("dotenv").config()
const { Util } = require("discord.js")

const sendMessage = {
  splitSend: async function(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      if(text.length > 2000){
        let messages = []
        const messageSplit = Util.splitMessage(text, { maxLength: 2000 })
        messageSplit.forEach(splitText => {
          messages.push(message.channel.send(splitText, options))
        })
        return await Promise.all(messageSplit)
      }
      return await message.channel.send(text, options)
    }
    return[text, options]
  },
  send: async function(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      return await message.channel.send(text, options)
    }
    return[text, options]
  },
  reply: async function(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      return await message.reply(text, options)
    }
    return[text, options]
  },
  author: async function(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      return await message.author.send(text, options)
    }
    return[text, options]
  },
  edit: async function(message, text, options={}){
    if(process.env.TEST != "TRUE"){
      return await message.edit(text, options)
    }
    return[text, options]
  },
}

module.exports = { sendMessage }