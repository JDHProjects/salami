let parseString = ``

let dataLocation = ""
let re = /\"n\":\"([a-zA-Z ]+)\"/g;
let matches = parseString.matchAll(re)
let names = Array.from(matches).map(match => match[1])
const fs = require('fs');

if (dataLocation != ""){
  fs.writeFile(`./assets/${dataLocation}names.json`, JSON.stringify(names, null, "\t"), err => {
    if (err) {
      console.log(err)
    }
    console.log(`${names.length} Names written to JSON`)
  })
}