const Discord = require("discord.js")
const { syncDB } = require("./db/functions/syncDB.js")
const { runEachCommand } = require("./db/functions/runEachCommand.js")
const { downDetector } = require("./functions/downDetector.js")

const fs = require("fs")
require("dotenv").config()
const prefix = process.env.PREFIX

const stringSimilarity = require("string-similarity")

const Sentry = require("@sentry/node")

Sentry.init({
  dsn: process.env.SENTRY_KEY,
  tracesSampleRate: 1.0,
  environment: process.env.ENVIRONMENT
})


const client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commandNames = []

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
  commandNames.push(command.name)
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  downDetector()
})

client.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/).map(arg => arg.toLowerCase())
    
  const commandName = args.shift()

  Sentry.setUser(
    { 
      id: `${message.author.id}`,
      username: `${message.author.username}`
    }
  )

  if (!client.commands.has(commandName)){

    const transaction = Sentry.startTransaction({
      op: "invalid_command",
      name: "invalid command",
    })

    let similar = stringSimilarity.findBestMatch(commandName, commandNames).bestMatch
    if (similar.rating < 0.3){
      message.channel.send("Sorry, I don't know that command!")
    }
    else{
      message.channel.send(`Sorry, I don't know that command!\nDid you mean:\n       \`${prefix}${similar.target}\``)
    }
    transaction.finish()
    return
  }

  const transaction = Sentry.startTransaction({
    op: commandName,
    name: commandName,
  })

  const command = client.commands.get(commandName)

  if (command.admin === true && process.env.OWNER != message.author.id){
    message.channel.send("You're not an admin!")
    transaction.finish()
    return
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }
  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 0) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount
    
    if (now < expirationTime) {
      const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
      let hours = Math.floor(timeLeft / 3600)
      let mins = Math.floor((timeLeft % 3600) / 60)
      let secs = Math.floor((timeLeft % 3600) % 60)

      message.reply(`please wait ${hours}:${mins}:${secs} before reusing the \`${command.name}\` command.`)
      transaction.finish()
      return
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  await runEachCommand(commandName, message.author.id.toString())
  try {
    await command.execute(message, args)
  } catch (error) {
    Sentry.captureException(error)
    message.channel.send("there was an error trying to execute that command!")
  } finally {
    transaction.finish()
  }
})

syncDB()
  .then(resp => {
    console.log(resp)
    client.login()
  })

module.exports = { client }
