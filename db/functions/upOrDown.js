const upOrDown = function(up) {
	return new Promise(function(resolve, reject) {
		const { botValues } = require('../db.js')

		botValues.findByPk("botConnected")
		.then(values => {
			let timeDown = 0
			if(values.dataValues.value == "false" && up == "true"){
					timeDown = (Date.now() - Date.parse(values.dataValues.updatedAt)) / 1000
			}
			if (values.dataValues.value != up){
				values.update({value:up})
			}
			resolve(timeDown)
		})
	})
};

module.exports = { upOrDown }