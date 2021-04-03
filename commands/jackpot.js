module.exports = {
	name: 'jackpot',
  description: 'Run this command to try and win the jackpot, currently there\'s a 1 in 5000 chance of winning. You could also win a spot prize. Roll 0 to win',
  usage: `just send jackpot`,
  example: '',
	execute(message, args) {
    const { bankAccounts, transfer } = require('../db/dbSetup.js')
    const spotPrizes = [1,2,3,4,5,6,7,8,9,10,
                        1111,2222,3333,4444,
                        1234,2345,3456,4567,
                        2468,1357,
                        1000,2000,3000,4000,
                      ]
    bankAccounts.findByPk(message.author.id)
    .then(user => {
      if(user.dataValues.money >= 2){
        bankAccounts.findByPk( "637400095821660180" )
        .then(salami => {
          result = 1000 //Math.floor(Math.random() * 5000)
          if(result == 0){
            let amount = salami.dataValues.money;
            message.channel.send(`<@${message.author.id}> **YOU WIN!!!!**\nTransferring ${amount} salami to your account!`)
            transfer(salami,user,amount)
          }
          else if(spotPrizes.includes(result)){
            let amount = (5000-result)*10 + Math.floor(Math.random() * 50);
            amount = salami.dataValues.money < amount ? salami.dataValues.money : amount;
            message.channel.send(`<@${message.author.id}> **SPOT PRIZE!!!!**\nTransferring ${amount} salami to your account!`)
            transfer(salami,user,amount)

          }
          else {
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