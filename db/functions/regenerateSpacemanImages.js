const regenerateSpacemanImages = async function() {
  const { spacemanImages } = require("../db.js")
  const { generatePngFromId } = require("../../functions/generateSpaceman.js")
  const fs = require("fs")

  let counter = 0
  let allImages = await spacemanImages.findAll()
  for (const spacemanImage of allImages) {
    if (!fs.existsSync(spacemanImage.dataValues.filepath)) {
      counter++
      await generatePngFromId(spacemanImage.dataValues.id)
    }
  }
  return `${counter} spaceman images regenerated from ID`
}

module.exports = { regenerateSpacemanImages }