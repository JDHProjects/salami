const { sendMessage } = require('../functions/sendMessage.js')
const { Op } = require("sequelize");

module.exports = {
	name: 'circulation',
	description: 'Run this command to see the total amount of salami in circulation',
	usage: `just send circulation`,
	example: '',
	execute: async function(message, args) {
			const { bankAccounts } = require('../db/db.js')

			let total = await bankAccounts.sum('money', { where: { user_id: { [Op.ne]: "0" } } } )
			let date = new Date();  
			let options = {  
					weekday: "long", year: "numeric", month: "short",  
					day: "numeric", hour: "2-digit", minute: "2-digit"  
			};  
			let salami = await bankAccounts.findByPk( "637400095821660180" )
			botMoney = salami.dataValues.money
			let messageText = sendMessage.send(message,`The current amount of salami in user circulation on ${date.toLocaleTimeString("en-us", options)} is:\n**${total} salami**\n<@637400095821660180> owns ${botMoney != 0 ? Math.floor((botMoney/total)*100) : 0}% of the salami in circulation`)
			return messageText
	},
};