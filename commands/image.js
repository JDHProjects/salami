const { searchForImage } = require("../functions/searchForImage.js")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "image",
  description: "Returns the first google image result of your choice.\nALL IMAGES FROM GOOGLE, I TAKE NO RESPONSIBILITY FOR THE IMAGES RETURNED",
  usage: "The word or phrase you want to search is the command argument",
  example: "nature landscape",
  execute: async function(message, args) {
    let messageText = ""
    if(args.length == 0){
      messageText = sendMessage.send(message, "No search term provided!")
      return messageText
    }
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
      try{
        let url = await searchForImage(allArgs,imageIndex)
        messageText = sendMessage.send(message, url)
      }
      catch(err){
        messageText = sendMessage.send(message, err) 
      }
      return messageText
    }
  },
}