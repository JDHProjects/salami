const lossWithTax = function(user, amount) {
	return new Promise(function(resolve, reject) {
		const { bankAccounts } = require('../db.js')

		let absAmount = Math.abs(amount)
		bankAccounts.findByPk("637400095821660180")
		.then(salami => {
			bankAccounts.findByPk("0")
			.then(bank => {
				tax = Math.floor(absAmount * 0.3)
				postTax = absAmount - tax

				let excess = 0
				if(salami.dataValues.money + postTax > 10000000){
					excess = salami.dataValues.money - 10000000 
					salami.decrement('money', {by: excess})
					excess += postTax
				}
				else{
					salami.increment('money', {by: postTax})
				}

				user.decrement('money', {by: absAmount})
				bank.increment('money', {by: tax + excess})

				resolve("loss taxed")
			});
		});
	})
};

module.exports = { lossWithTax }