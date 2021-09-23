const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "server",
  description: "General server data (region, members etc)",
  usage: "Just send server, theres really not much to this",
  example: "",
  execute: async function(message, args) {
    if (message.guild != null){
      return await sendMessage.send(message, `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer Owner: <@${message.guild.ownerID}>\nCurrent Host Region: ${message.guild.region}\nEstablished: ${message.guild.createdAt}`)
    }
    return await sendMessage.send(message, "You're not in a server!")
  },
}