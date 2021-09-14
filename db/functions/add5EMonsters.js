const monsters = require('../../assets/monsters/data/data.json');

const add5EMonsters = function() {
	return new Promise(function(resolve, reject) {
		const { fiveEMonsters } = require('../db.js')
		fiveEMonsters.bulkCreate(monsters)
		.then(resp => {
			resolve(`${resp.length} monsters added to database`)
		})
		.catch(err => {
			reject("error adding monsters")
		})
	})
};

module.exports = { add5EMonsters }