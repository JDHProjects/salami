const Discord = require('discord.js')
const { prefix, token } = require('./config.json');
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {

    if (msg.content.substring(0, 1) == prefix) {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
    
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                msg.channel.send('Pong!')
                break;
            case 'pong':
                msg.channel.send('Wrong way round idiot!')
                break;
            case 'stop':
                msg.channel.send('Don\'t tell me what to do')
                break;
            case 'server':
                if (msg.guild.available){
                    msg.channel.send(`
                    Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}\nServer Owner: ${msg.guild.owner}\nCurrent Host Region: ${msg.guild.region}\nEstablished: ${msg.guild.createdAt}
                    `)
                }
                else{
                    msg.channel.send('Hmmm, I can\'t find the server, is it down?')
                }
                break;
            default:
                msg.channel.send('Sorry, I don\'t know that command yet!')
                break;

        }
    }
})

client.login(token)