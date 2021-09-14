const transfer = function(sender, reciever, amount) {
	return new Promise(function(resolve, reject) {
		let absAmount = Math.abs(Math.round(amount))
		if (sender.dataValues.money < absAmount){
			absAmount = sender.dataValues.money
		}
		reciever.increment('money', {by: absAmount})
		sender.decrement('money', {by: absAmount})
		resolve("money transferred")
	})
};

module.exports = { transfer }