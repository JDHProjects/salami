module.exports = {
	name: 'money',
  description: 'Main way to interface with your bank account balance',
  usage: `With no args it returns your balance, or with args you can send to others`,
  example: 'send @Salami 10',
	execute(message, args) {
    const { bankAccounts } = require('../db/dbSetup.js')

    if (message.mentions.users.size > 0){
     transferUser = message.mentions.users.first()
    }
    else{
      transferUser = null
    }

    send = false
    list = false
    amount = 0
    for (i in args){
      if (args[i] == "send"){
        send = true
      }
      if (args[i] == "list"){
        list = true
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = parseInt(args[i])
      }
    }
    if (list){
      bankAccounts.findAll( { order: [['money', 'DESC']] } )
      .then(bankUsers => {
        total=0
        buildMsg=`**Money distribution:**\n`
        for (i in bankUsers) {
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
                  sender.decrement('money', {by: amount})
                  receiver.increment('money', {by: amount})
                  message.channel.send(`${amount} salami transferred from <@${message.author.id}> to <@${transferUser.id}>`)
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
};