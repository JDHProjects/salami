const { Op } = require("sequelize");

module.exports = {
	name: 'circulation',
  description: 'Run this command to see the total amount of salami in circulation',
  usage: `just send circulation`,
  example: '',
	execute(message, args) {
    const { bankAccounts } = require('../db/db.js')

    bankAccounts.sum('money', { where: { user_id: { [Op.ne]: "0" } } } )
    .then(total => {
      let date = new Date();  
      let options = {  
          weekday: "long", year: "numeric", month: "short",  
          day: "numeric", hour: "2-digit", minute: "2-digit"  
      };  
      bankAccounts.findByPk( "637400095821660180" )
        .then(salami => {
          botMoney = salami.dataValues.money
          message.channel.send(`The current amount of salami in user circulation on ${date.toLocaleTimeString("en-us", options)} is:\n**${total} salami**\n<@637400095821660180> owns ${Math.floor((botMoney/total)*100)}% of the salami in circulation`)
        })
    })
	},
};