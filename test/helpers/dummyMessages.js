const Discord = require("discord.js")

module.exports = {
  dummyMessage: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection(),
    },
    client: {
      commands: new Discord.Collection(),
    },
    attachments: new Discord.Collection(),
    channel: {
      startTyping() {
        return
      },
      stopTyping() {
        return
      }
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
  dummyMessageWithOtherUserMention: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection( [ [ 2, { id: 2 } ] ] ),
    }
  },
  dummyMessageWithCommands: { 
    author: {
      id: 12345
    },
    client: {
      commands: new Discord.Collection( [ [ "non_admin_command", { name: "non_admin_command", description: "valid description", usage: "valid usage", example: "valid example" } ], [ "admin_command", { name: "admin_command", description: "valid description", usage: "valid usage", example: "valid example", admin: true } ] ] ),
    }
  },
  dummyMessageWithCommandsAsAdmin: { 
    author: {
      id: 1
    },
    client: {
      commands: new Discord.Collection( [ [ "non_admin_command", { name: "non_admin_command", description: "valid description", usage: "valid usage", example: "valid example" } ], [ "admin_command", { name: "admin_command", description: "valid description", usage: "valid usage", example: "valid example", admin: true } ] ] ),
    }
  },
  dummyMessageWithAttachment: { 
    author: {
      id: 12345
    },
    mentions: {
      users: new Discord.Collection(),
    },
    attachments: new Discord.Collection( [ [ "test.txt", { name: "test.txt" } ] ] ),
  },
  dummyMessageWithNoKeysAttachmentAsAdmin: { 
    author: {
      id: 1
    },
    mentions: {
      users: new Discord.Collection(),
    },
    attachments: new Discord.Collection( [ [ "test.txt", { name: "test.txt", url: "no_keys" } ] ] ),
  },
  dummyMessageWithKeysAttachmentAsAdmin: { 
    author: {
      id: 1
    },
    mentions: {
      users: new Discord.Collection(),
    },
    attachments: new Discord.Collection( [ [ "test.txt", { name: "test.txt", url: "keys" } ] ] ),
  },
  dummyMessageWithJPEGAttachmentAsAdmin: { 
    author: {
      id: 1
    },
    mentions: {
      users: new Discord.Collection(),
    },
    attachments: new Discord.Collection( [ [ "image.jpeg", { name: "image.jpeg" } ] ] ),
  },
}