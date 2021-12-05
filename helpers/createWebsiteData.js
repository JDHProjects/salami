const fs = require("fs")
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commandNames = []

for (const file of commandFiles) {
  const command = require(`../commands/${file}`)
  commandNames.push({ display: command.display, name: command.name, description: command.description, usage: command.usage, example: command.example, admin: command.admin ? true : false})
}

fs.writeFile("./web/src/assets/commands.json", JSON.stringify(commandNames, null, 2), err => {
  if (err) {
    console.log(err)
  }
  console.log(`${commandNames.length} commands written to JSON`)
})