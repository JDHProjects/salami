const add5ESpells = function() {
	return new Promise(function(resolve, reject) {
		const { fiveESpells } = require('../db.js')
		const spells = require('../../assets/spells/data/data.json');

		fiveESpells.count()
		.then(c => {
			fiveESpells.bulkCreate(spells, {ignoreDuplicates: true})
			.then(resp => {
				fiveESpells.count()
				.then(c2 => {
					resolve(`${c2-c} spells added to database`)
				})
			})
			.catch(err => {
				reject("error adding spells")
			})
		})
	})
};

module.exports = { add5ESpells }