const { sendFromBank } = require('./sendFromBank.js')

const runEachCommand = function(commandName, userID) {
	return new Promise(function(resolve, reject) {
    const { commandStats, bankAccounts } = require('../db.js')
    
		commandStats.findOrCreate({
		where: { 
			user_id: userID,
			command_name: commandName 
		}})
		.then(user => {
			user[0].increment('count')
			bankAccounts.findOrCreate({
			where: { user_id: userID }
			})
			.then(bankUser => {
				sendFromBank(bankUser[0], 1)
				.then(resp => {
					resolve("command registered")
				})
			})
		});
	})
};

module.exports = { runEachCommand }