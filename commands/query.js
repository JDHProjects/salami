module.exports = {
  name: "query",
  description: "Sends a query to the database",
  usage: "query with sql query after",
  example: "",
  admin: true,
  execute(message, args) {
    const { sequelize } = require("../db/db.js")

    let querystring = ""
    for (let i in args){
      querystring += args[i]
      if (i < args.length -1){
        querystring += " "
      }
    }
    message.author.send("DB backup file", { files: ["./database.sqlite"] })
    sequelize.query(querystring)
      .then( resp => {
        message.channel.send(`Response:\n${JSON.stringify(resp)}\nResponse complete`, { split: true })
      })
  },
}