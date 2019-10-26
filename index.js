const Discord = require('discord.js')
const { prefix, token } = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)){
        message.channel.send('Sorry, I don\'t know that command yet!');
        return;
    }

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('there was an error trying to execute that command!');
    }
});

client.login(token)