const { wild_values } = require('../assets/wildSurge/table.json');

module.exports = {
	name: 'wildsurge',
    description: 'Gives a random wild surge (1 of 10,000). Data from https://github.com/haa-gg/Improbability-Drive',
    usage: 'Just send wildsurge, theres really not much to this',
    example: '',
	execute(message, args) {
        randInt = Math.floor((Math.random() * wild_values.length));
        message.delete()
        message.channel.send(`You rolled ${randInt}: ${wild_values[randInt]}`);
	},
};