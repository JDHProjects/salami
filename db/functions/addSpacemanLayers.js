const addSpacemanLayers = async function() {
  const { spacemanLayers } = require("../db.js")
  const spacemen = require("../../assets/spaceman/layers/data.json")

  let c = await spacemanLayers.count()
  await spacemanLayers.bulkCreate(spacemen, {ignoreDuplicates: true})
  let c2 = await spacemanLayers.count()
  return `${c2-c} spaceman variants added to database`
}

module.exports = { addSpacemanLayers }