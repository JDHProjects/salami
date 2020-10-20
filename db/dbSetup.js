const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const commandStats = require('../models/command_stats')(sequelize, Sequelize.DataTypes);
const bankAccounts = require('../models/bank_accounts')(sequelize, Sequelize.DataTypes);

const runEachCommand = function(userID) {
	return new Promise(function(resolve, reject) {
		commandStats.findByPk(userID)
		.then(user => {
			if (user === null){
				commandStats.create({user_id: userID})
			}
			bankAccounts.findByPk(userID)
			.then(user => {
				if (user === null){
					bankAccounts.create({user_id: userID})
				}
				else{
					user.increment('money')
				}
				resolve("User added")
			})
		})
	})
};

sequelize.sync({alter:true})
module.exports = { runEachCommand, commandStats, bankAccounts };