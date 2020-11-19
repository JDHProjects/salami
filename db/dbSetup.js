const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const commandStats = require('../models/command_stats')(sequelize, Sequelize.DataTypes);
const bankAccounts = require('../models/bank_accounts')(sequelize, Sequelize.DataTypes);

const runEachCommand = function(commandName, userID) {
	return new Promise(function(resolve, reject) {
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
				bankUser[0].increment('money')
				resolve("User added")
			})
		});
	})
};

sequelize.sync()
bankAccounts.findOrCreate({ where: { user_id: "637400095821660180" } })
module.exports = { runEachCommand, commandStats, bankAccounts };