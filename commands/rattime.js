module.exports = {
	name: 'rattime',
	description: 'Sends rat time image',
	execute(message, args) {
        message.channel.send('T I M E  F O R  R A T', {
		files: [
            "./assets/rattime.jpg"
        ]
        });
	},
};