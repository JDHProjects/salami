const add5EItems = function() {
	return new Promise(function(resolve, reject) {
		const { fiveEItems } = require('../db.js')
		const items = require('../../assets/items/data/data.json');

		fiveEItems.count()
		.then(c => {
			fiveEItems.bulkCreate(items, {updateOnDuplicate: true})
			.then(resp => {
				fiveEItems.count()
				.then(c2 => {
					resolve(`${c2-c} items added to database`)
				})
			})
			.catch(err => {
				reject("error adding items")
			})
		})
	})
};

module.exports = { add5EItems }