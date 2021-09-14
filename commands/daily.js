module.exports = {
	name: 'daily',
    description: 'this command allows you to receive 1000 salami once every 24 hours',
    usage: 'Just send daily, theres really not much to this',
    cooldown: 86400,
    example: 'daily',
	execute(message, args) {
        const { bankAccounts } = require('../db/db.js')
        const { sendFromBank } = require('../db/functions/sendFromBank.js')
        
        bankAccounts.findByPk(message.author.id)
        .then(user => {
            sendFromBank(user, 1000)
            message.reply("your 1000 salami have been transferred to your bank account!")
        });
    }
};