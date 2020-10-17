const Discord = require('discord.js')
const { prefix, token } = require('./config.json');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
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
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)){
        message.channel.send('Sorry, I don\'t know that command yet!');
        return;
    }

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('there was an error trying to execute that command!');
    }
    
    saveStats(commandName, message.author.id)

});

client.login(token)

function saveStats(commandName, authorId){
    let data = fs.readFileSync('assets/usage-stats/commands-per-user.csv', 'utf8')
    statArray = parse(data, {
        skip_empty_lines: true
    })

    //append untracked command to array
    if(!statArray[0].includes(commandName)){
        for (x in statArray) {
            if (x == 0){
                statArray[x].push(commandName)
            }
            else{
                statArray[x].push(0)
            } 
        }
    }

    //get user index
    let loc = -1
    for (x in statArray){
        if(statArray[x][0] == authorId){
            loc = x
        }
    }

    //append untracked user to array
    if (loc == -1 ){
        let recordBuilder = []
        for (x in statArray[0]){
            recordBuilder.push(0)
        }
        recordBuilder[0] = authorId
        statArray.push(recordBuilder)
        loc = statArray.length - 1
    }

    statArray[loc][statArray[0].indexOf(commandName)] += 1

    fs.writeFile('assets/usage-stats/commands-per-user.csv', stringify(statArray, []), function (err) {
        if (err) throw err;
      });
}