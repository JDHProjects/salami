const { sendMessage } = require('../functions/sendMessage.js')

module.exports = {
	name: 'fixmoney',
	description: 'Used by an admin to change a users money. + to add, - to remove, = to set equal. Mention the user to change',
	usage: `fixmoney`,
	example: '',
	admin: true,
	execute(message, args) {
		return new Promise(async function(resolve, reject) {
			const { bankAccounts } = require('../db/db.js')
			const { refreshBank } = require('../db/functions/refreshBank.js')

			let messageText = ""
			
			if (message.mentions.users.size > 0){
				targetUser = message.mentions.users.first()
			}
			else{
				messageText = sendMessage.reply(message, "No user specified")
				return
			}
			let plus = false
			let minus = false
			let setTo = false
			let amount = -1
			for (i in args){
				if (args[i] == "+"){
					plus = true
				}
				if (args[i] == "-"){
					minus = true
				}
				if (args[i] == "="){
					setTo = true
				}
				else if (!isNaN(parseInt(args[i]))){
					amount = Math.abs(parseInt(args[i]))
				}
			}
			if(!(plus || minus || setTo))
			{
				messageText = sendMessage.reply(message, "No amount modifier specified")
				return
			}
			if(amount < 0)
			{
				messageText = sendMessage.reply(message, "No amount specified")
				return
			}
			let target = await bankAccounts.findByPk(targetUser.id)
			if (plus){
				target.increment('money', {by: amount})
			}
			else if (minus){
				target.decrement('money', {by: amount})
			}
			else if (setTo){
				target.update({money:amount})
			}
			refreshBank()
			messageText = sendMessage.send(`<@${targetUser.id}>'s money has been updated`)
			resolve(messageText)
		})
	},
};