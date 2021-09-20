module.exports = {
  name: "money",
  description: "Main way to interface with your bank account balance",
  usage: "With no args it returns your balance, or with args you can send to others",
  example: "send @Salami 10",
  execute(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { transfer } = require("../db/functions/transfer.js")

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
      bankAccounts.findAll( { order: [["money", "DESC"]] } )
        .then(bankUsers => {
          let total=0
          let buildMsg="**Money distribution:**\n"
          for (let i in bankUsers) {
            buildMsg+=`${parseInt(i)+1}) ${bankUsers[i].dataValues.user_id != "0" ? "<@"+bankUsers[i].dataValues.user_id+">" : "The Bank"} : ${bankUsers[i].dataValues.money} salami\n`
            total += bankUsers[i].dataValues.money
          }
          message.channel.send(buildMsg+`\n**Total salami: ${total}**`)
        })
    }
    else{
      bankAccounts.findByPk(message.author.id)
        .then(sender => {
          if (transferUser != null){
            if (amount <= sender.dataValues.money){
              bankAccounts.findByPk(transferUser.id)
                .then(receiver => {
                  if(receiver != undefined){
                    if(send){
                      transfer(sender,receiver,amount)
                      message.channel.send(`${Math.abs(amount)} salami transferred from <@${message.author.id}> to <@${transferUser.id}>`)
                    }
                    else{
                      message.channel.send(`<@${transferUser.id}> has ${receiver.dataValues.money} salami`)
                    }
                  }
                  else{
                    message.channel.send(`<@${transferUser.id}> doesn't have a bank account, the first time they use the bot, one will be generated for them`)
                  }
                })
            }
            else{
              message.channel.send(`<@${message.author.id}>, you don't have enough salami`)
            }
          }
          else{
            message.channel.send(`<@${message.author.id}>, you have: ${sender.dataValues.money} salami`)
          }
        })
    }
  },
}