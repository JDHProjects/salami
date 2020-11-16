const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    user_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		command_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		count: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
  }

	return sequelize.define('command_stats',
		buildModel
	, {
		timestamps: false,
	});
};