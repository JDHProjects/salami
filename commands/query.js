const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  display: "Database Query",
  name: "query",
  description: "Sends a query to the database",
  usage: "query with sql query after",
  example: "",
  admin: true,
  tested: true,
  execute: async function(message, args) {
    const { sequelize } = require("../db/db.js")

    let messages = []

    let querystring = ""
    for (let i in args){
      querystring += args[i]
      if (i < args.length -1){
        querystring += " "
      }
    }
    messages.push(await sendMessage.author(message, "DB backup file", { files: ["./database.sqlite"] }))
    let resp = await sequelize.query(querystring)
    messages.push(await sendMessage.splitSend(message, `Response:\n${JSON.stringify(resp)}\nResponse complete`))
    return messages
  },
}