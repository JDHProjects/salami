let parseString = ""

let dataLocation = "monsters/"

let cleanString = parseString.replaceAll("\\\"","\"").replaceAll("\"[","[").replaceAll("]\"","]")
let dataObject = JSON.parse(cleanString)
let nameArray = dataObject.listResults.map(itemName => itemName.n)
const fs = require("fs")

if (dataLocation != ""){
  fs.writeFile(`./assets/${dataLocation}names/names.json`, JSON.stringify(nameArray, null, "\t"), err => {
    if (err) {
      console.log(err)
    }
    console.log(`${nameArray.length} Names written to JSON`)
  })
}