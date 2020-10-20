const Discord = require('discord.js')
const { prefix, token } = require('./config.json');
const { commandStats, runEachCommand } = require('./db/dbSetup.js')

const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const adminIDs = [249937022033068044,163266240863797249]

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  commandStats.sync({alter:true});
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)){
        message.channel.send('Sorry, I don\'t know that command yet!');
        return;
    }

    const command = client.commands.get(commandName);

    if (command.admin === true && !adminIDs.includes(parseInt(message.author.id))){
        message.channel.send("You're not an admin!");
        return;
    }

    runEachCommand(message.author.id)
    .then(resp =>{
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('there was an error trying to execute that command!');
        }
        
        saveStats(commandName, message.author.id)
    })


    

});

client.login(token)

function saveStats(commandName, authorId){
    commandStats.findByPk(authorId)
    .then(stat => {
        stat.increment(commandName)
    })
}