var gis = require('g-i-s');


module.exports = {
	name: 'image',
	description: 'Returns the first google image result of your choice.\nALL IMAGES FROM GOOGLE, I TAKE NO RESPONSIBILITY FOR THE IMAGES RETURNED',
	usage: 'The word or phrase you want to search is the command argument',
    example: 'nature landscape',
	execute(message, args) {
            if(args.length > 0){
                imageIndex = 0;
                allArgs = ""
                for (i in args){
                    if (i > 0){
                        allArgs+=" ";
                    }
                    if (i < args.length - 1 || isNaN(args[i])){
                        allArgs+=args[i];
                    }
                    else{
                        imageIndex = args[args.length-1];
                    }
                }
                
                gis(allArgs, function (error, results) {
                    if (!error && results[0] != undefined) {
                        if (imageIndex >= results.length){
                            imageIndex = 0;
                        }
                        message.channel.send(results[imageIndex].url);
                      }
                    else {
                        
                        message.channel.send('Something went wrong, please try again!') 
                    }
                });
                
            }
	},
};