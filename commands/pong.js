module.exports = {
	name: 'pong',
	description: 'You\'ve got this all backwards',
	usage: 'Just send pong, theres really not much to this',
    example: '',
	execute(message, args) {
		message.channel.send('Wrong way round idiot!')
	},
};