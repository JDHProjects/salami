var gis = require("g-i-s")

const searchForImage = function(search, index) {
  return new Promise(function(resolve, reject) {
    gis(search, function (error, results) {
      if (!error && results[0] != undefined) {
        if (index >= results.length){
          index = 0
        }
        resolve(results[index].url)
      }
      else {
        reject("Something went wrong, please try again!")
      }
    })
  })
}

module.exports = { searchForImage }
