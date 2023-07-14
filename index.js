const { Client, Collection, Events, GatewayIntentBits, Partials } = require("discord.js")
const { syncDB } = require("./db/functions/syncDB.js")
const { runEachCommand } = require("./db/functions/runEachCommand.js")
const { downDetector } = require("./functions/downDetector.js")

const fs = require("fs")
require("dotenv").config()

const Sentry = require("@sentry/node")
// eslint-disable-next-line  no-unused-vars
const SentryTracing = require("@sentry/tracing")

Sentry.init({
  dsn: process.env.SENTRY_KEY,
  tracesSampleRate: 1.0,
  environment: process.env.ENVIRONMENT
})

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], partials: [Partials.Channel] })


client.commands = new Collection()
const cooldowns = new Collection()
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
const commandNames = []

for (const file of commandFiles) {
  let command = require(`./commands/${file}`)
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
    commandNames.push(command.data.name)
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  downDetector()
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  Sentry.setUser(
    { 
      id: `${interaction.user.id}`,
      username: `${interaction.user.username}`
    }
  )

  const transaction = Sentry.startTransaction({
    op: interaction.commandName,
    name: interaction.commandName,
  })

  if (command.admin === true && process.env.OWNER != interaction.user.id){
    interaction.reply({content: "You're not an admin!", ephemeral: true})
    transaction.finish()
    return
  }

  if (command.cooldown != undefined) {
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection())
    }
    const now = Date.now()
    const timestamps = cooldowns.get(command.data.name)
    const cooldownAmount = (command.cooldown || 0) * 1000

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
      
      if (now < expirationTime) {
        const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
        let hours = Math.floor(timeLeft / 3600)
        let mins = Math.floor((timeLeft % 3600) / 60)
        let secs = Math.floor((timeLeft % 3600) % 60)

        interaction.reply({content:`please wait ${hours}:${mins}:${secs} before reusing the \`${command.data.name}\` command.`, ephemeral: true})
        transaction.finish()
        return
      }
    }

    timestamps.set(interaction.user.id, now)
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
  }

  await runEachCommand(interaction.commandName, interaction.user.id.toString())
  try {
    await command.execute(interaction)
  } catch (error) {
    Sentry.captureException(error)
    console.log(error)
    interaction.reply("there was an error trying to execute that command!")
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
