const { sendFromBank } = require("./sendFromBank.js")

const runEachCommand = async function(commandName, userID) {
  const { commandStats, bankAccounts } = require("../db.js")
    
  let user = await commandStats.findOrCreate({
    where: { 
      user_id: userID,
      command_name: commandName 
    }
  })
  user[0].increment("count")
  let bankUser = await bankAccounts.findOrCreate({
    where: { user_id: userID }
  })
  await sendFromBank(bankUser[0], 1)
  return "command registered"
}

module.exports = { runEachCommand }