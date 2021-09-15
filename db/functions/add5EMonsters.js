const add5EMonsters = function() {
	return new Promise(function(resolve, reject) {
		const { fiveEMonsters } = require('../db.js')
		const monsters = require('../../assets/monsters/data/data.json');

		fiveEMonsters.count()
		.then(c => {
			fiveEMonsters.bulkCreate(monsters, {ignoreDuplicates: true})
			.then(resp => {
				fiveEMonsters.count()
				.then(c2 => {
					resolve(`${c2-c} monsters added to database`)
				})
			})
			.catch(err => {
				reject("error adding monsters")
			})
		})
	})
};

module.exports = { add5EMonsters }