const setUserMoney = async function(userMoney, user=12345) {
  const { sequelize, bankAccounts } = require("../../db/db.js")

  await sequelize.sync()
  await bankAccounts.upsert({ user_id: user, money: userMoney })
  return "money set"
}

module.exports = { setUserMoney }