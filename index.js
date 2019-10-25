const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {

if (message.content.substring(0, 1) == '!') {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];
    
    args = args.splice(1);
    switch(cmd) {
        // !ping
        case 'ping':
            msg.reply('Pong!')
        break;
        // Just add any case commands if you want to..
        }
    }
})

client.login('NjM3NDAwMDk1ODIxNjYwMTgw.XbNnJQ.YEIIW5YlZX197fu_wuXMX8VoSmY')