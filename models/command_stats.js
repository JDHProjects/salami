const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
  }

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    buildModel[command.name] = {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		}
  }

	return sequelize.define('command_stats',
		buildModel
	, {
		timestamps: false,
	});
};