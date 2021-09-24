const add5EMonsters = async function() {
  const { fiveEMonsters } = require("../db.js")
  const monsters = require("../../assets/monsters/data/data.json")

  let c = await fiveEMonsters.count()
  await fiveEMonsters.bulkCreate(monsters, {ignoreDuplicates: true})
  let c2 = await fiveEMonsters.count()
  return `${c2-c} monsters added to database`
}

module.exports = { add5EMonsters }