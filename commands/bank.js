module.exports = {
	name: 'bank',
  description: 'Check the amount the central bank has',
  usage: `just send bank, theres really not much to this`,
  example: '',
	execute(message, args) {
    const { bankAccounts } = require('../db/db.js')

		bankAccounts.findByPk("0")
    .then(bank => {
      bankAccounts.sum('money')
      .then(total => {
        message.channel.send(`The bank currently holds:\n**${bank.dataValues.money} salami**\nWhich is ${Math.floor((bank.dataValues.money/total)*100)}% of the total market`)
      })
    })
	},
};