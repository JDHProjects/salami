const add5EItems = async function() {
  const { fiveEItems } = require("../db.js")
  const items = require("../../assets/items/data/data.json")

  let c = await fiveEItems.count()
  await fiveEItems.bulkCreate(items, {ignoreDuplicates: true})
  let c2 = await fiveEItems.count()
  return `${c2-c} items added to database`
}

module.exports = { add5EItems }