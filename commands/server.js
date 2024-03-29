const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  display: "Server Info",
  name: "server",
  description: "General server data (region, members etc)",
  usage: "Just send server, theres really not much to this",
  example: "",
  tested: true,
  execute: async function(message, args) {
    if (message.guild != null){
      return await sendMessage.send(message, `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer Owner: <@${message.guild.ownerId}>\nCurrent Host Region: ${message.guild.region}\nEstablished: ${message.guild.createdAt}`)
    }
    return await sendMessage.send(message, "You're not in a server!")
  },
}