const addSpacemanImages = async function() {
  const { spacemanImages } = require("../db.js")
  const spells = require("../../assets/spaceman/data.json")

  let c = await spacemanImages.count()
  await spacemanImages.bulkCreate(spells, {ignoreDuplicates: true})
  let c2 = await spacemanImages.count()
  return `${c2-c} spaceman variants added to database`
}

module.exports = { addSpacemanImages }