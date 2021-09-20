const getUserMoney = async function(user=12345) {
  const { sequelize, bankAccounts } = require("../../db/db.js")

  let money = -1
  await sequelize.sync()
  let userRecord = await bankAccounts.findByPk(user)
  if (userRecord != null){
    money = userRecord.dataValues.money
  }
  return money
}

module.exports = { getUserMoney }