const lossWithTax = async function(user, amount) {
  const { bankAccounts } = require("../db.js")

  let absAmount = Math.abs(amount)
  let salami = await bankAccounts.findByPk("637400095821660180")
  let bank = await bankAccounts.findByPk("0")

  let tax = Math.floor(absAmount * 0.3)
  let postTax = absAmount - tax

  let excess = 0
  if(salami.dataValues.money + postTax > 10000000){
    excess = salami.dataValues.money - 10000000 
    salami.decrement("money", {by: excess})
    excess += postTax
  }
  else{
    salami.increment("money", {by: postTax})
  }

  user.decrement("money", {by: absAmount})
  bank.increment("money", {by: tax + excess})

  return "loss taxed"
}

module.exports = { lossWithTax }