module.exports = {
	name: 'rat-time',
    description: 'Sends rat time image',
    usage: `Just send rat-time, theres really not much to this`,
    example: '',    
	execute(message, args) {
        randInt = Math.floor((Math.random() * 5) + 1);
        
        if (randInt === 1){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time/rat-time1.jpg"
                ]
            });
        }
        else if (randInt === 2){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time/rat-time2.jpg"
                ]
            });
        }
        else if (randInt === 3){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time/rat-time3.png"
                ]
            });
        }
        else if (randInt === 4){ 
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time/rat-time4.png"
                ]
            });
        }
        else{
            message.channel.send('T I M E  F O R  R A T', {
                files: [
                    "./assets/rat-time/rat-time5.png"
                ]
            });
        }
	},
};