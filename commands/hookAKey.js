require("dotenv").config()

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "hook-a-key",
  description: "Spend 50k salami for a steam game key",
  usage: "Just send hook-a-key, theres not much to this",
  example: "",
  execute: async function(message, args) {
    const { bankAccounts, hookAKeys, sequelize } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    let messageText = ""
    if(message.attachments.size == 1){
      if(process.env.OWNER == message.author.id){
        if(message.attachments.first().name.slice(-3) == "txt"){
          let fileContents = await getContentsOfUrl(message.attachments.first().url)
          let re = /[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]/g
          let allKeys = fileContents.match(re)
          let bulkCreator = []
          if (allKeys != null){
            messageText = sendMessage.reply(message, `${allKeys.length} key(s) found in sent file`)
            for (let i in allKeys){
              bulkCreator.push({
                key: allKeys[i]
              })
            }
            await hookAKeys.bulkCreate(bulkCreator, {ignoreDuplicates: true})
            messageText[0] += sendMessage.reply(message, "any non-duplicate keys have been added!")[0]
          }
          else{
            messageText = sendMessage.reply(message, "no keys found in sent file")
          }
        }
        else{
          messageText = sendMessage.reply(message, "A new key file must be a .txt file")
        }
      }
      else {
        messageText = sendMessage.reply(message, "Sorry, only admins can add new keys")
      }
      return messageText
    }
    let user = await bankAccounts.findByPk(message.author.id)
    if (user.dataValues.money >= 50000){
      let key = await hookAKeys.findOne({ order: sequelize.random(), where: { claimed:  "none" }})
      if(key != null){
        lossWithTax(user, 50000)
        key.update({claimed:message.author.id})
        messageText = sendMessage.author(message, `Enjoy your new game!\nSteam key: ${key.dataValues.key}`)
        messageText[0] += sendMessage.reply(message, "key has been sent via DM")[0]
      }
      else{
        messageText = sendMessage.reply(message, "sorry, I'm all out of keys!")
      }
    }
    else{
      messageText = sendMessage.reply(message, "you can't afford a new game")
    }
    return messageText
  },
}

const getContentsOfUrl = function(url) {
  return new Promise(function(resolve, reject) {
    if (process.env.TEST == "TRUE"){
      if (url == "no_keys"){
        resolve("")
      }
      else if (url == "keys"){
        resolve("AAAAA-AAAAA-AAAAA")
      }
    }
    else {
      const fetchUrl = require("fetch").fetchUrl

      fetchUrl(url, async function(error, meta, body){
        if (!error && body != undefined) {
          resolve(body.toString())
        }
        else {
          reject("Something went wrong, please try again!")
        }
      })
    }
  })
}