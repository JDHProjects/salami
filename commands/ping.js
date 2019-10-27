module.exports = {
	name: 'ping',
	description: 'A simple ping pong',
	usage: 'Just send ping, theres really not much to this',
    example: 'ping',
	execute(message, args) {
		message.channel.send('Pong!');
	},
};