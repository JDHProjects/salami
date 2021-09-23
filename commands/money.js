const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "money",
  description: "Main way to interface with your bank account balance",
  usage: "With no args it returns your balance, or with args you can send to others",
  example: "send @Salami 10",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { transfer } = require("../db/functions/transfer.js")

    let messageText = ""

    let transferUser = null
    if (message.mentions.users.size > 0){
      transferUser = message.mentions.users.first()
    }

    let send = false
    let list = false
    let amount = 0
    for (let i in args){
      if (args[i] == "send"){
        send = true
      }
      if (args[i] == "list"){
        list = true
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = Math.abs(parseInt(args[i]))
      }
    }
    if (list){
      let bankUsers = await bankAccounts.findAll( { order: [["money", "DESC"]] } )
      let total=0
      let buildMsg="**Money distribution:**\n"
      for (let i in bankUsers) {
        buildMsg+=`${parseInt(i)+1}) ${bankUsers[i].dataValues.user_id != "0" ? "<@"+bankUsers[i].dataValues.user_id+">" : "The Bank"} : ${bankUsers[i].dataValues.money} salami\n`
        total += bankUsers[i].dataValues.money
      }
      messageText = sendMessage.send(message, buildMsg+`\n**Total salami: ${total}**`)
    }
    else{
      let sender = await bankAccounts.findByPk(message.author.id)
      if (transferUser != null){
        if (amount <= sender.dataValues.money){
          let receiver = await bankAccounts.findByPk(transferUser.id)
          if(receiver != undefined){
            if(send){
              await transfer(sender,receiver,amount)
              messageText = sendMessage.send(message, `${Math.abs(amount)} salami transferred from <@${message.author.id}> to <@${transferUser.id}>`)
            }
            else{
              messageText = sendMessage.send(message, `<@${transferUser.id}> has ${receiver.dataValues.money} salami`)
            }
          }
          else{
            messageText = sendMessage.send(message, `<@${transferUser.id}> doesn't have a bank account, the first time they use the bot, one will be generated for them`)
          }
        }
        else{
          messageText = sendMessage.reply(message, "you don't have enough salami")
        }
      }
      else{
        messageText = sendMessage.reply(message, `you have: ${sender.dataValues.money} salami`)
      }
    }
    return messageText
  },
}