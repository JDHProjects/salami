module.exports = {
	name: 'rat-time',
    description: 'Sends rat time image',
    usage: `Just send rat-time, theres really not much to this`,
    example: '',    
	execute(message, args) {
        randInt = Math.floor((Math.random() * 13) + 1);
        message.channel.send('T I M E  F O R  R A T', {
            files: [
                "./assets/rat-time/rat-time"+randInt+".png"                
            ]
        });
        
	},
};