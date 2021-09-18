const { sendMessage } = require('../functions/sendMessage.js')

module.exports = {
	name: 'bank',
  description: 'Check the amount the central bank has',
  usage: `just send bank, theres really not much to this`,
  example: '',
	execute(message, args) {
    return new Promise(async function(resolve, reject) {
      const { bankAccounts } = require('../db/db.js')
      let bank = await bankAccounts.findByPk("0")
      let total = await bankAccounts.sum('money')
      
      let messageText = sendMessage(message, `The bank currently holds:\n**${bank.dataValues.money} salami**\nWhich is ${Math.floor((bank.dataValues.money/total)*100)}% of the total market`)
      resolve(messageText)
    })
  },
};