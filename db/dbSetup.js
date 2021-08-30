const { time } = require('cron');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const stocks = require('../models/stocks')(sequelize, Sequelize.DataTypes);
const commandStats = require('../models/command_stats')(sequelize, Sequelize.DataTypes);
const bankAccounts = require('../models/bank_accounts')(sequelize, Sequelize.DataTypes);
const hookAKeys = require('../models/hook_a_keys')(sequelize, Sequelize.DataTypes);
const botValues = require('../models/bot_values')(sequelize, Sequelize.DataTypes);

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
					resolve("command registered")
				})
			})
		});
	})
};

const lossWithTax = function(user, amount) {
	return new Promise(function(resolve, reject) {
		let absAmount = Math.abs(amount)
		bankAccounts.findByPk("637400095821660180")
		.then(salami => {
			bankAccounts.findByPk("0")
			.then(bank => {
				tax = Math.floor(absAmount * 0.3)
				postTax = absAmount - tax

				let excess = 0
				if(salami.dataValues.money + postTax > 10000000){
					excess = salami.dataValues.money - 10000000 
					salami.decrement('money', {by: excess})
					excess += postTax
				}
				else{
					salami.increment('money', {by: postTax})
				}

				user.decrement('money', {by: absAmount})
				bank.increment('money', {by: tax + excess})

				resolve("loss taxed")
			});
		});
	})
};

const sendFromBank = function(user, amount) {
	return new Promise(function(resolve, reject) {
		let absAmount = Math.abs(Math.round(amount))
		bankAccounts.findByPk("0")
		.then(bank => {
			if (bank.dataValues.money > 0){
				user.increment('money', {by: absAmount})
				bank.decrement('money', {by: absAmount})
				resolve("money sent")
			}
			else{
				resolve("no money in bank")
			}
		})
	})
};

const transfer = function(sender, reciever, amount) {
	return new Promise(function(resolve, reject) {
		let absAmount = Math.abs(Math.round(amount))
		if (sender.dataValues.money < absAmount){
			absAmount = sender.dataValues.money
		}
		reciever.increment('money', {by: absAmount})
		sender.decrement('money', {by: absAmount})
		resolve("money transferred")
	})
};

const refreshBank = function() {
	return new Promise(function(resolve, reject) {
		bankAccounts.findOrCreate({ where: { user_id: "637400095821660180" } })
		bankAccounts.sum('money')
		.then(total => {
			bankAccounts.findOrCreate({ where: { user_id: "0" } })
			.then( bank => {
				if (total != 1000000000){
					bank[0].increment( 'money', { by: 1000000000 - total} )
					resolve("bank refreshed")
				}
			})
		})
	})
};

const upOrDown = function(up) {
	return new Promise(function(resolve, reject) {
		botValues.findByPk("botConnected")
		.then(values => {
			let timeDown = 0
			if(values.dataValues.value == "false" && up == "true"){
					timeDown = (Date.now() - Date.parse(values.dataValues.updatedAt)) / 1000
			}
			if (values.dataValues.value != up){
				values.update({value:up})
			}
			resolve(timeDown)
		})
	})
};



sequelize.sync();

botValues.findOrCreate({ where: { variable: "botConnected" } })
refreshBank();

module.exports = { runEachCommand, stocks, commandStats, bankAccounts, hookAKeys, upOrDown, sequelize, lossWithTax, sendFromBank, transfer, refreshBank };