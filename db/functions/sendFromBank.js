const sendFromBank = async function(user, amount) {
  const { bankAccounts } = require("../db.js")
  
  let absAmount = Math.abs(Math.round(amount))
  let bank = await bankAccounts.findByPk("0")
  if (bank.dataValues.money > 0){
    user.increment("money", {by: absAmount})
    bank.decrement("money", {by: absAmount})
    return "money sent"
  }
  return "no money in bank"
}

module.exports = { sendFromBank }