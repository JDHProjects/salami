const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const commandStats = require('../models/command_stats')(sequelize, Sequelize.DataTypes);

module.exports = { commandStats };