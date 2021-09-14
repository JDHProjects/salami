const refreshBank = function() {
	return new Promise(function(resolve, reject) {
		const { bankAccounts } = require('../db.js')

		bankAccounts.findOrCreate({ where: { user_id: "637400095821660180" } })
		.then(_ => {
			bankAccounts.sum('money')
			.then(total => {
				bankAccounts.findOrCreate({ where: { user_id: "0" } })
				.then( bank => {
					if (total != 1000000000){
						bank[0].increment( 'money', { by: 1000000000 - total} )
						resolve("Bank refreshed")
					}
					resolve("Bank refreshed")
				})
			})
		})
	})
};

module.exports = { refreshBank }