const Discord = require("discord.js")

module.exports = {
  dummyMessage: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection(),
    }
  },
  dummyMessageWithMention: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection( [ [ 12345, { id: 12345 } ] ] ),
    }
  }
}