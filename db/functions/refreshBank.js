const refreshBank = async function() {
  const { bankAccounts } = require("../db.js")

  await bankAccounts.findOrCreate({ where: { user_id: "637400095821660180" } })
  let total = await bankAccounts.sum("money")
  let bank = await bankAccounts.findOrCreate({ where: { user_id: "0" } })
  if (total != 1000000000){
    bank[0].increment( "money", { by: 1000000000 - total} )
  }
  return "Bank refreshed"
}

module.exports = { refreshBank }