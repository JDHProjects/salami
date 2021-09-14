const sendFromBank = function(user, amount) {
	return new Promise(function(resolve, reject) {
    const { bankAccounts } = require('../db.js')
    
		let absAmount = Math.abs(Math.round(amount))
		bankAccounts.findByPk("0")
		.then(bank => {
			if (bank.dataValues.money > 0){
				user.increment('money', {by: absAmount})
				bank.decrement('money', {by: absAmount})
				resolve("money sent")
			}
			else{
				resolve("no money in bank")
			}
		})
	})
};

module.exports = { sendFromBank }