module.exports = {
	name: 'marketcap',
  description: 'Run this command to see the total value of the bots market',
  usage: `just send marketcap`,
  example: '',
	execute(message, args) {
    const { bankAccounts } = require('../db/dbSetup.js')

    bankAccounts.sum('money')
    .then(total => {
      let date = new Date();  
      let options = {  
          weekday: "long", year: "numeric", month: "short",  
          day: "numeric", hour: "2-digit", minute: "2-digit"  
      };  
      bankAccounts.findByPk( "637400095821660180" )
        .then(salami => {
          botMoney = salami.dataValues.money
          message.channel.send(`The current market cap on ${date.toLocaleTimeString("en-us", options)} is:\n**${total} salami**\n<@637400095821660180> owns ${Math.floor((botMoney/total)*100)}% of the market cap`)
        })
    })
	},
};