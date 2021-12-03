const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "dbbackup",
  description: "Used to backup database by sending a copy of the database file to your private messages",
  usage: "just send dbbackup, theres really not much to this",
  example: "",
  admin: true,
  tested: true,
  execute: async function(message, args) {
    let messageText = await sendMessage.author(message, "DB backup file", { files: ["./database.sqlite"] })
    return messageText
  }
}