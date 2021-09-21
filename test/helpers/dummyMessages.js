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
  },
  dummyMessageWithCommands: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection(),
    },
    client: {
      commands: new Discord.Collection( [ [ "non_admin_command", { name: "non_admin_command", description: "valid description", usage: "valid usage", example: "valid example" } ], [ "admin_command", { name: "admin_command", description: "valid description", usage: "valid usage", example: "valid example", admin: true } ] ] ),
    }
  },
  dummyMessageWithCommandsAsAdmin: { 
    author: {
      id: 1
    },
    mentions: {
      users: new Discord.Collection(),
    },
    client: {
      commands: new Discord.Collection( [ [ "non_admin_command", { name: "non_admin_command", description: "valid description", usage: "valid usage", example: "valid example" } ], [ "admin_command", { name: "admin_command", description: "valid description", usage: "valid usage", example: "valid example", admin: true } ] ] ),
    }
  },
}