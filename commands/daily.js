const { sendMessage } = require('../functions/sendMessage.js')

module.exports = {
	name: 'daily',
	description: 'this command allows you to receive 1000 salami once every 24 hours',
	usage: 'Just send daily, theres really not much to this',
	cooldown: 86400,
	example: 'daily',
	execute(message, args) {
		return new Promise(async function(resolve, reject) {
			const { bankAccounts } = require('../db/db.js')
			const { sendFromBank } = require('../db/functions/sendFromBank.js')
			
			let user = await bankAccounts.findByPk(message.author.id)

			sendFromBank(user, 1000)
			let messageText = sendMessage(message, "your 1000 salami have been transferred to your bank account!", reply=true)
			resolve(messageText)
		})
}
};