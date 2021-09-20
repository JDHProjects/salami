const setUserMoney = function(userMoney, user=12345) {
  return new Promise(async function(resolve, reject) {
    const { sequelize, bankAccounts } = require('../../db/db.js')

    await sequelize.sync();
    await bankAccounts.upsert({ user_id: user, money: userMoney })
    resolve("money set")
  })
}

module.exports = { setUserMoney }