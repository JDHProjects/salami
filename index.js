const Discord = require('discord.js')
const { prefix, token, adminIDs } = require('./config.json');
const { commandStats, runEachCommand } = require('./db/dbSetup.js')

const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/).map(arg => arg.toLowerCase());
    
	const commandName = args.shift();

	if (!client.commands.has(commandName)){
        message.channel.send('Sorry, I don\'t know that command yet!');
        return;
    }

    const command = client.commands.get(commandName);

    if (command.admin === true && !adminIDs.includes(parseInt(message.author.id))){
        message.channel.send("You're not an admin!");
        return;
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
            let hours = Math.floor(timeLeft / 3600)
            let mins = Math.floor((timeLeft % 3600) / 60)
            let secs = Math.floor((timeLeft % 3600) % 60)

            return message.reply(`please wait ${hours}:${mins}:${secs} before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    runEachCommand(commandName, message.author.id.toString())
    .then(resp =>{
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('there was an error trying to execute that command!');
        }
    })
});

client.login(token)
