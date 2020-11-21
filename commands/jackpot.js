module.exports = {
	name: 'jackpot',
  description: 'Run this command to try and win the jackpot, currently there\'s a 1 in 10,000 chance of winning',
  usage: `just send jackpot`,
  example: '',
	execute(message, args) {
    const { bankAccounts } = require('../db/dbSetup.js')

    bankAccounts.findByPk(message.author.id)
    .then(user => {
      if(user.dataValues.money >= 2){
        bankAccounts.findByPk( "637400095821660180" )
        .then(salami => {
          result = Math.floor(Math.random() * 10000)
          if(result == 0){
            amount = salami.dataValues.money
            message.channel.send(`<@${message.author.id}> **YOU WIN!!!!**\nTransferring ${amount} salami to your account!`)
            user.increment('money', {by: amount})
            salami.decrement('money', {by: amount})
          }
          else{
            user.decrement('money', {by: 2})
            salami.increment('money', {by: 2})
            message.channel.send(`<@${message.author.id}>, you didn't win the jackpot, better luck next time`)
          }
        })
      }
      else{
        message.channel.send(`Sorry <@${message.author.id}>, you need at least 2 salami to play`)
      }
    })

		
	},
};