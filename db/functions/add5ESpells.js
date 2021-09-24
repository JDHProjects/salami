const add5ESpells = async function() {
  const { fiveESpells } = require("../db.js")
  const spells = require("../../assets/spells/data/data.json")

  let c = await fiveESpells.count()
  await fiveESpells.bulkCreate(spells, {ignoreDuplicates: true})
  let c2 = await fiveESpells.count()
  return `${c2-c} spells added to database`
}

module.exports = { add5ESpells }