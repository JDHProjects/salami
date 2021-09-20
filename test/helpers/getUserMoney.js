const getUserMoney = function(user=12345) {
  return new Promise(async function(resolve, reject) {
    const { sequelize, bankAccounts } = require('../../db/db.js')

    let money = -1
    await sequelize.sync();
    let userRecord = await bankAccounts.findByPk(user)
    if (userRecord != null){
      money = userRecord.dataValues.money
    }
    resolve(money)
  })
}

module.exports = { getUserMoney }