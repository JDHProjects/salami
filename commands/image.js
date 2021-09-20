const { searchForImage } = require("../functions/searchForImage.js")

module.exports = {
  name: "image",
  description: "Returns the first google image result of your choice.\nALL IMAGES FROM GOOGLE, I TAKE NO RESPONSIBILITY FOR THE IMAGES RETURNED",
  usage: "The word or phrase you want to search is the command argument",
  example: "nature landscape",
  execute(message, args) {
    if(args.length > 0){
      let imageIndex = 0
      let allArgs = ""
      for (let i in args){
        if (i > 0){
          allArgs+=" "
        }
        if (i < args.length - 1 || isNaN(args[i])){
          allArgs+=args[i]
        }
        else{
          imageIndex = args[args.length-1]
        }
      }
      searchForImage(allArgs,imageIndex)
        .then(url => {
          message.channel.send(url)
        })
        .catch(err => {
          message.channel.send(err) 
        })
    }
  },
}