module.exports = {
	name: 'coinflip',
  description: 'Flip a coin, guess on the result, you can even bet on the result if you want',
  usage: `requires either "heads" or "tails", bet by providing a number as an additional arg`,
  example: 'heads 100',
	execute(message, args) {
    const { bankAccounts } = require('../db/dbSetup.js')

    amount = 0
    guess = -1
    for (i in args){
      if (args[i] == "heads"){
        guess=1
      }
      else if (args[i] == "tails"){
        guess=0
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = parseInt(args[i])
      }
    }

    if(guess != -1){
      bankAccounts.findByPk(message.author.id)
      .then(user => {
        if (amount <= user.dataValues.money){
          flip = Math.floor(Math.random() * 2) 
          if(flip == guess){
            message.channel.send(`${flip == 1 ? "heads" : "tails"}! <@${message.author.id}>, you win!`)
            user.increment('money', {by: amount})
          }
          else{
            message.channel.send(`${flip == 1 ? "heads" : "tails"}! <@${message.author.id}>, you lose`)
            user.decrement('money', {by: amount})
            bankAccounts.findByPk( "637400095821660180" )
            .then(salami => {
              salami.increment('money', {by: amount})
            })
          }
        }
        else{
          message.channel.send(`<@${message.author.id}>, you don't have enough salami to make that bet`)
        }
      })
    }
    else{
      message.channel.send(`You forgot to pick heads or tails!`)
    }

		
	},
};