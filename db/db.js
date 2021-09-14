const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const stocks = require('./models/stocks')(sequelize, Sequelize.DataTypes);
const commandStats = require('./models/command_stats')(sequelize, Sequelize.DataTypes);
const bankAccounts = require('./models/bank_accounts')(sequelize, Sequelize.DataTypes);
const hookAKeys = require('./models/hook_a_keys')(sequelize, Sequelize.DataTypes);
const botValues = require('./models/bot_values')(sequelize, Sequelize.DataTypes);
const fiveEMonsters = require('./models/5e_monsters')(sequelize, Sequelize.DataTypes);

const { add5EMonsters } = require('./functions/add5EMonsters.js')
const { refreshBank } = require('./functions/refreshBank.js')

const syncDB = function() {
	return new Promise(function(resolve, reject) {
		sequelize.sync()
		.then(_ => {
			botValues.findOrCreate({ where: { variable: "botConnected" } })
			.then(_ => {
				refreshBank()
				.then(bankResp => {
					console.log(bankResp)
          add5EMonsters()
          .then(monsterResp =>{
            console.log(monsterResp)
            resolve("Database synced")
          })
				})
			})
		});
	})
}

module.exports = {sequelize, stocks, commandStats, bankAccounts, hookAKeys, botValues, fiveEMonsters, syncDB };