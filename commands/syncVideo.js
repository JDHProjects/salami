var request = require("request")

module.exports = {
	name: 'syncvideo',
	description: 'Generates a random sync video room to use',
	usage: 'Just send syncvideo, theres really not much to this',
    example: 'syncvideo',
	execute(message, args) {
            request({url:'http://www.sync-video.com/random',followAllRedirects :false}, function (error, response, body) {
                try{
                    message.channel.send(response.request.uri.href) 
                }
                catch (e) {
                    message.channel.send('Something went wrong, please try again!') 
                }
            });
       
	},
};

