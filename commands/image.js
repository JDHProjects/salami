const { searchForImage } = require("../functions/searchForImage.js")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  display: "Image Search",
  name: "image",
  description: "Returns the first google image result of your choice.\nALL IMAGES FROM GOOGLE, I TAKE NO RESPONSIBILITY FOR THE IMAGES RETURNED",
  usage: "The word or phrase you want to search is the command argument",
  example: "nature landscape",
  tested: true,
  execute: async function(message, args) {
    let messageText = ""
    if(args.length == 0){
      messageText = await sendMessage.send(message, "No search term provided!")
      return messageText
    }
    let imageIndex = 0
    let allArgs = ""
    if(isNaN(args[args.length-1])){
      allArgs = args.join(" ")
    }
    else{
      imageIndex = args[args.length-1]
      allArgs = args.slice(0,args.length-1).join(" ")
    }
    try{
      let url = await searchForImage(allArgs,imageIndex)
      messageText = await sendMessage.send(message, url)
    }
    catch(err){
      messageText = await sendMessage.send(message, err) 
    }
    return messageText
  },
}