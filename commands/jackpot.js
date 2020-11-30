module.exports = {
	name: 'jackpot',
  description: 'Run this command to try and win the jackpot, currently there\'s a 1 in 5000 chance of winning. Roll 0 to win',
  usage: `just send jackpot`,
  example: '',
	execute(message, args) {
    const { bankAccounts, transfer } = require('../db/dbSetup.js')

    bankAccounts.findByPk(message.author.id)
    .then(user => {
      if(user.dataValues.money >= 2){
        bankAccounts.findByPk( "637400095821660180" )
        .then(salami => {
          result = Math.floor(Math.random() * 5000)
          if(result == 0){
            amount = salami.dataValues.money
            message.channel.send(`<@${message.author.id}> **YOU WIN!!!!**\nTransferring ${amount} salami to your account!`)
            transfer(salami,user,amount)
          }
          else{
            transfer(user,salami,2)
            message.channel.send(`<@${message.author.id}>, you didn't win the jackpot, better luck next time. You rolled ${result}`)
          }
        })
      }
      else{
        message.channel.send(`Sorry <@${message.author.id}>, you need at least 2 salami to play`)
      }
    })

		
	},
};