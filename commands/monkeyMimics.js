module.exports = {
	name: 'monkey-mimics',
    description: 'Sends 3 different images of monkeys to the channel, and one to the user privately. Imitate the noise you think your secret monkey would make and see if anyone can guess which monkey you\'re mimicking',
    usage: `Just send monkey-mimics, theres really not much to this`,
    example: '',    
	execute(message, args) {
        let photoCount = 257
        let monkeyOne = 0
        let monkeyTwo = 0
        let monkeyThree = 0
        monkeyOne = Math.floor((Math.random() * photoCount) + 1);
        do {
            monkeyTwo = Math.floor((Math.random() * photoCount) + 1);
        } while (monkeyTwo === monkeyOne)
        do {
            monkeyThree = Math.floor((Math.random() * photoCount) + 1);
        } while (monkeyThree === monkeyOne || monkeyThree === monkeyTwo)
        message.reply('Lets play Monkey Mimics!');
        message.channel.send({
            files: [
                "./assets/monkey-mimics/"+monkeyOne+".jpeg"
            ]
        });
        message.channel.send({
            files: [
                "./assets/monkey-mimics/"+monkeyTwo+".jpeg"
            ]
        });
        message.channel.send({
            files: [
                "./assets/monkey-mimics/"+monkeyThree+".jpeg"
            ]
        });
        message.author.send('Heres your monkey to imitate!', {
            files: [
                "./assets/monkey-mimics/"+monkeyOne+".jpeg"
            ]
        });
        
	},
};