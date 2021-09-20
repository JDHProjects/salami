module.exports = {
  name: "server",
  description: "General server data (region, members etc)",
  usage: "Just send server, theres really not much to this",
  example: "",
  execute(message, args) {
    if (message.guild != null){
      message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer Owner: <@${message.guild.ownerID}>\nCurrent Host Region: ${message.guild.region}\nEstablished: ${message.guild.createdAt}`)
    }
    else{
      message.channel.send("You're not in a server!")
    }
  },
}