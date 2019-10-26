module.exports = {
	name: 'stop',
	description: 'stop',
	execute(message, args) {
		message.channel.send('Don\'t tell me what to do')
	},
};