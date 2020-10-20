module.exports = {
	name: 'money',
  description: 'Tells you your bank account balance',
  usage: `Just send money, theres really not much to this`,
  example: '',
	execute(message, args) {
    const { bankAccounts } = require('../db/dbSetup.js')
		bankAccounts.findByPk(message.author.id)
    .then(user => {
      message.channel.send(`<@${message.author.id}>, you have: ${user.dataValues.money} pepperoni${user.dataValues.money>1?"s":""}`)
    })
	},
};