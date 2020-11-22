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
				sendFromBank(bankUser[0], 1)
				.then(resp => {
					resolve("User added")
				})
			})
		});
	})
};

const lossWithTax = function(user, amount) {
	return new Promise(function(resolve, reject) {
		bankAccounts.findByPk("637400095821660180")
		.then(salami => {
			bankAccounts.findByPk("0")
			.then(bank => {
				tax = Math.floor(amount * 0.3)
				postTax = amount - tax
				user.decrement('money', {by: amount})
				salami.increment('money', {by: postTax})
				bank.increment('money', {by: tax})
				resolve("loss taxed")
			});
		});
	})
};

const sendFromBank = function(user, amount) {
	return new Promise(function(resolve, reject) {
		bankAccounts.findByPk("0")
		.then(bank => {
			if (bank.dataValues.money > 0){
				user.increment('money', {by: amount})
				bank.decrement('money', {by: amount})
				resolve("money sent")
			}
		})
	})
};

sequelize.sync()
bankAccounts.findOrCreate({ where: { user_id: "637400095821660180" } })
bankAccounts.sum('money')
.then(total => {
	bankAccounts.findOrCreate({ where: { user_id: "0" } })
	.then( bank => {
		if (total < 5000000){
			bank[0].increment( 'money', { by: 5000000 - total} )
		}
	})
})
module.exports = { runEachCommand, commandStats, bankAccounts, sequelize, lossWithTax, sendFromBank };