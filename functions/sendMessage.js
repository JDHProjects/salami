require('dotenv').config();

const sendMessage = function(message, text, options={}, reply=false){
  //console.log("hello")
  if(process.env.TEST != "TRUE"){
    if (reply) {
      //message.reply(text, options)
    }
    else {
      //message.channel.send(text, options)
    }
  }
  return[text, options]
}

module.exports = { sendMessage }