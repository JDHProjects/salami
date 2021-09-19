const setUserMoney = function(userMoney, user=1) {
  return new Promise(async function(resolve, reject) {
    const { sequelize, bankAccounts } = require('../../db/db.js')

    await sequelize.sync();
    await bankAccounts.upsert({ user_id: user, money: userMoney })
    resolve("money set")
  })
}
setUserMoney()
module.exports = { setUserMoney }