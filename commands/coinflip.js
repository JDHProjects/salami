const { sendMessage } = require('../functions/sendMessage.js')

module.exports = {
	name: 'coinflip',
	description: 'Flip a coin, guess on the result, you can even bet on the result if you want',
	usage: `requires either "heads" or "tails", bet by providing a number as an additional arg`,
	cooldown: 2,
	example: 'heads 100',
	execute: async function(message, args) {
			const { bankAccounts } = require('../db/db.js')
			const { lossWithTax } = require('../db/functions/lossWithTax.js')
			const { sendFromBank } = require('../db/functions/sendFromBank.js')

			let messageText = ""

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
					amount = Math.abs(parseInt(args[i]))
				}
			}

			if(guess != -1){
				let user = await bankAccounts.findByPk(message.author.id)
				if (amount <= user.dataValues.money){
					flip = Math.floor(Math.random() * 2) 
					if(flip == guess){
						messageText = sendMessage.send(message,`${flip == 1 ? "heads" : "tails"}! <@${message.author.id}>, you win!`)
						sendFromBank(user, amount)
					}
					else{
						messageText = sendMessage.send(message,`${flip == 1 ? "heads" : "tails"}! <@${message.author.id}>, you lose`)
						lossWithTax(user, amount)
					}
				}
				else{
					messageText = sendMessage.send(message,`<@${message.author.id}>, you don't have enough salami to make that bet`)
				}
			}
			else{
				messageText = sendMessage.send(message,`You forgot to pick heads or tails!`)
			}
			return messageText
	},
};