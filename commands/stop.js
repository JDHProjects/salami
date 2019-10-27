module.exports = {
	name: 'stop',
	description: 'Salami has some sass',
	usage: `Just send stop, theres really not much to this`,
    example: '',
	execute(message, args) {
		message.channel.send('Don\'t tell me what to do')
	},
};