const images = require("images")

const generateSpaceman = async function(ownerId) {
  const { spacemanImages } = require("../db/db.js")

  let spacemanId = await generateUniqueId()
  await spacemanImages.create({id: spacemanId, owner_id: ownerId, filepath: `./assets/spaceman/generated/${spacemanId}.png`})
  await generatePngFromId(spacemanId)
  return {id: spacemanId, owner_id: ownerId, filepath: `./assets/spaceman/generated/${spacemanId}.png`}
}

const generatePngFromId = async function(spacemanId){
  const { spacemanLayers } = require("../db/db.js")
  let layers = ["backpack", "face", "visor", "chest", "patch", "suit", "ears"]
  let splitId = spacemanId.match(/[A-F0-9][A-F0-9]/g)
  let imageList = []
  for (let i = 0; i < layers.length; i++){
    let imageData = await spacemanLayers.findOne({
      where:  {
        layer: layers[i],
        layer_id: splitId[i]
      }
    })
    imageList.push(imageData)
  }

  await images(imageList[0].dataValues.filepath).size(1500) //backpack
    .draw(images(imageList[1].dataValues.filepath), 0, 0) //face
    .draw(images(imageList[2].dataValues.filepath), 0, 0) //visor
    .draw(images(imageList[3].dataValues.filepath), 0, 0) //chest
    .draw(images(imageList[4].dataValues.filepath), 0, 0) //patch
    .draw(images(imageList[5].dataValues.filepath), 0, 0) //suit
    .draw(images(imageList[6].dataValues.filepath), 0, 0) //ears
    .save(`assets/spaceman/generated/${spacemanId}.png`)
  return
}

const generateUniqueId = async function(){
  const { spacemanLayers, spacemanImages, sequelize } = require("../db/db.js")

  let layers = ["backpack", "face", "visor", "chest", "patch", "suit", "ears"]
  let spacemanId = ""

  let unique = false
  while (!unique){
    for (const layer of layers) {
      let imageData = await spacemanLayers.findOne({
        order: sequelize.random(),
        where:  { layer: layer }
      })
      spacemanId += imageData.dataValues.layer_id
    }
    unique = ((await spacemanImages.findByPk(spacemanId)) == null)
  }
  return spacemanId
}

module.exports = { generateSpaceman, generatePngFromId }