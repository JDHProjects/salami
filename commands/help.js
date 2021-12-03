require("dotenv").config()
const prefix = process.env.PREFIX

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  usage: `You can send \`${prefix}help [command name]\` to get info on a specific command!`,
  example: "ping",
  tested: true,
  execute: async function(message, args) {
    const data = []
    const { commands } = message.client

    if (args.length > 0) {
      const name = args[0].toLowerCase()
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

      if (!command) {
        data.push("that's not a valid command!")
      }
      else if(command.admin != null && process.env.OWNER != message.author.id){
        data.push("You're not an admin!")
      }
      else{
        data.push(`**Name:** ${command.name}`)
        if (command.description) data.push(`**Description:** ${command.description}`)
        if (command.usage) data.push(`**Usage:** ${command.usage}`)
        command.example ? data.push(`**Example:** ${prefix}${command.name} ${command.example}`) : data.push(`**Example:** ${prefix}${command.name}`)
      }
    }
    else{
      data.push("Here's a list of all my commands:")
      data.push(commands.filter(command =>  command.admin == null).map(command => command.name).join(", "))
      if(process.env.OWNER == message.author.id){
        data.push("\nYou're an admin, so here's a list of the admin commands you can use:")
        data.push(commands.filter(command =>  command.admin != null).map(command => command.name).join(", "))
      }
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)
    }

    let messageText = await sendMessage.splitSend(message, data.join("\n"))
    return messageText
  },
}