module.exports = {
	name: 'dicegame',
  description: 'Roll a dice, guess on the result, you can even bet on the result if you want',
  usage: `requires from "one" to "six" in words, bet by providing a number as an additional arg`,
  cooldown: 2,
  example: '"one" 100',
	execute(message, args) {
    const { bankAccounts, lossWithTax, sendFromBank } = require('../db/dbSetup.js')

    wordsToNum={
      one:1,
      two:2,
      three:3,
      four:4,
      five:5,
      six:6
    }
    numToWords={
      1:"one",
      2:"two",
      3:"three",
      4:"four",
      5:"five",
      6:"six"
    }

    amount = 0
    guess = -1
    guessInWords = ""
    for (i in args){
      if(wordsToNum[args[i]] != undefined){
        guess=wordsToNum[args[i]]
        guessInWords=args[i]
      }
      else if (!isNaN(parseInt(args[i]))){
        amount = parseInt(args[i])
      }
    }

    if(guess != -1){
      bankAccounts.findByPk(message.author.id)
      .then(user => {
        if (amount <= user.dataValues.money){
          result = Math.floor(Math.random() * 6) + 1 
          if(result == guess){
            message.channel.send(`${numToWords[result]}! <@${message.author.id}>, you win!`)
            sendFromBank(user, amount*5)
          }
          else{
            message.channel.send(`${numToWords[result]}! <@${message.author.id}>, you lose`)
            lossWithTax(user, amount)
          }
        }
        else{
          message.reply(`you don't have enough salami to make that bet`)
        }
      })
    }
    else{
      message.channel.send(`You forgot to make a guess!`)
    }

		
	},
};