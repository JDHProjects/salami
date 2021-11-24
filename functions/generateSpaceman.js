const images = require("images");

const generateSpaceman = async function(ownerId) {
  const { generatedSpacemans } = require("../db/db.js")

  let spacemanId = ""
  let imageList = []
  let unique = false
  while (!unique){
    returnArray = await getIdAndImageList()
  
    spacemanId = returnArray[0]
    unique = ((await generatedSpacemans.findByPk(spacemanId)) == null)
    imageList = returnArray[1]
  }

  let spaceBuffer = await images(imageList[0].dataValues.filepath).size(1500) //backpack
  .draw(images(imageList[1].dataValues.filepath), 0, 0) //face
  .draw(images(imageList[2].dataValues.filepath), 0, 0) //visor
  .draw(images(imageList[3].dataValues.filepath), 0, 0) //chest
  .draw(images(imageList[4].dataValues.filepath), 0, 0) //patch
  .draw(images(imageList[5].dataValues.filepath), 0, 0) //suit
  .draw(images(imageList[6].dataValues.filepath), 0, 0) //ears
  .draw(images(imageList[7].dataValues.filepath), 0, 0) //antenna
  .encode("png");

  await generatedSpacemans.create({id: spacemanId, owner_id: ownerId, image: spaceBuffer})

  return spaceBuffer
}
const getFromCategory = async function(category_name){
  const { spacemanImages, sequelize } = require("../db/db.js")

  searchTerm = {
    order: sequelize.random(),
    where:  { category: category_name }
  }
  return await spacemanImages.findOne(searchTerm)

}

const getIdAndImageList = async function(){
  let categories = ["backpack", "face", "visor", "chest", "patch", "suit", "ears", "antenna"]
  let spacemanId = ""
  let imageList = []

  for await (const category of categories) {
    let imageData = await getFromCategory(category)
    imageList.push(imageData)
    spacemanId += imageData.dataValues.category_id
  }
  return [spacemanId, imageList]
}

module.exports = { generateSpaceman }