const fs = require("fs")

const createSpacemanImagesJSON = async function() {
  let items = recursiveSearch("./assets/","spaceman")
  fs.writeFileSync("./assets/spaceman/data.json", JSON.stringify(items, null, 2))
  console.log(`${items.length} items written to JSON`)
}

const recursiveSearch = function(baseUrl, current) {
  let filesList = []
  let url = baseUrl + current
  fs.readdirSync(url).forEach( function (file, index){
    if(fs.lstatSync(url+"/"+file).isDirectory()){
      filesList = filesList.concat(recursiveSearch(url+"/", file))
    }
    else if (file.slice(-3) == "png"){
      filesList.push({category: current, category_id: file.slice(0,2), filepath: url+"/"+file, name: "", description: "" })
    }
  })
  return filesList
}

createSpacemanImagesJSON()