require("dotenv").config()
const { Util } = require("discord.js")

const sendMessage = {
  splitSend: async function(message, text){
    if(process.env.TEST != "TRUE"){
      if(text.length > 2000){
        let messages = []
        const messageSplit = Util.splitMessage(text, { maxLength: 2000 })
        messageSplit.forEach(splitText => {
          messages.push(message.channel.send(splitText))
        })
        return await Promise.all(messageSplit)
      }
      return await message.channel.send(text)
    }
    return { content:text }
  },
  send: async function(message, text, options={}){
    if(text != ""){
      options.content = text
    }
    if(process.env.TEST != "TRUE"){
      return await message.channel.send(options)
    }
    return options
  },
  reply: async function(message, text, options={}){
    if(text != ""){
      options.content = text
    }
    if(process.env.TEST != "TRUE"){
      return await message.reply(options)
    }
    return options
  },
  author: async function(message, text, options={}){
    if(text != ""){
      options.content = text
    }
    if(process.env.TEST != "TRUE"){
      return await message.author.send(options)
    }
    return options
  },
  edit: async function(message, text, options={}){
    if(text != ""){
      options.content = text
    }
    if(process.env.TEST != "TRUE"){
      return await message.edit(options)
    }
    return options
  },
}

module.exports = { sendMessage }