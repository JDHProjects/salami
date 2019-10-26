module.exports = {
	name: 'server',
	description: 'General server data',
	execute(message, args) {
		if (message.guild.available){
            message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer Owner: ${message.guild.owner}\nCurrent Host Region: ${message.guild.region}\nEstablished: ${message.guild.createdAt}`)
        }
        else{
            message.channel.send('Hmmm, I can\'t find the server, is it down?')
        }
	},
};