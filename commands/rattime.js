module.exports = {
	name: 'rat-time',
	description: 'Sends rat time image',
	execute(message, args) {
        randInt = Math.random();
        if (randInt < 0.25){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time1.jpg"
                ]
            });
        }
        else if (randInt < 0.50){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time2.jpg"
                ]
            });
        }
        else if (randInt < 0.75){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time3.png"
                ]
            });
        }
        else{
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time4.png"
                ]
            });
        }
	},
};