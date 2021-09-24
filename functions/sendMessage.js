require("dotenv").config()

const sendMessage = {
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