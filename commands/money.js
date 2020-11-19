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
    amount = 0
    for (i in args){
      if (args[i] == "send"){
        send = true
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = parseInt(args[i])
      }
    }
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
	},
};