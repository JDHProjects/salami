const { add5EMonsters } = require('./add5EMonsters.js')
const { add5ESpells } = require('./add5ESpells.js')
const { add5EItems } = require('./add5EItems.js')
const { refreshBank } = require('./refreshBank.js')
const { sequelize, botValues } = require('../db.js')

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
						add5ESpells()
						.then(spellResp =>{
							console.log(spellResp)
							add5EItems()
							.then(itemResp =>{
								console.log(itemResp)
								resolve("Database synced")
							})
						})
          })
				})
			})
		});
	})
}

module.exports = { syncDB }