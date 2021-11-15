const fs = require('fs');

const addSpacemanImages = async function() {
  const { spacemanImages } = require("../db.js")
  const baseUrl = "./assets/"

  let items = recursiveSearch(baseUrl,"spaceman")

  let c = await spacemanImages.count()
  await spacemanImages.bulkCreate(items, {ignoreDuplicates: true})
  let c2 = await spacemanImages.count()
  return `${c2-c} spaceman variants added to database`
}

const recursiveSearch = function(baseUrl, current) {
  let filesList = []
  let url = baseUrl + current
  fs.readdirSync(url).forEach( function (file, index){
    if(fs.lstatSync(url+"/"+file).isDirectory()){
      filesList = filesList.concat(recursiveSearch(url+"/", file))
    }
    else if (file.slice(-3) == "png"){
      filesList.push({category: current, category_id: index.toString(16).padStart(2,"0"), filepath: url+"/"+file })
    }
  })
  return filesList
}

module.exports = { addSpacemanImages }