const { add5EMonsters } = require("./add5EMonsters.js")
const { add5ESpells } = require("./add5ESpells.js")
const { add5EItems } = require("./add5EItems.js")
const { addSpacemanImages } = require("./addSpacemanImages.js")
const { refreshBank } = require("./refreshBank.js")
const { sequelize, botValues } = require("../db.js")

const syncDB = async function() {
  let resolveMsg = ""
  await sequelize.sync()
  await botValues.findOrCreate({ where: { variable: "botConnected" } })
  resolveMsg += `${await refreshBank()}\n`
  resolveMsg += `${await add5EMonsters()}\n`
  resolveMsg += `${await add5ESpells()}\n`
  resolveMsg += `${await add5EItems()}\n`
  resolveMsg += `${await addSpacemanImages()}\n`

  return `${resolveMsg}Database synced`
}

module.exports = { syncDB }