const gold_values = require('../assets/gold/gold.json');

module.exports = {
    name: 'gold',
    description: 'DND party gold counter (Server wide)',
    usage: 'set [number] to set gold, add [number] to add gold, remove [number] to remove gold. Send gold to check total',
    example: 'add 10',
	execute(message, args) {
        var fs = require('fs');
        messageText = ""
        if(gold_values[message.guild.id] === undefined){
            gold_values[message.guild.id] = 0
        }
        if (args[0] != undefined && args[1] != undefined && !isNaN(parseInt(args[1])) ){
            if (args[0].toLowerCase() == "set"){
                gold_values[message.guild.id] = parseInt(args[1])
                messageText += "gold set to " + args[1] + "\n"
                
            }
            else if (args[0].toLowerCase() == "add"){
                gold_values[message.guild.id] += parseInt(args[1])
                messageText += args[1] + " gold added\n"
            }
            else if (args[0].toLowerCase() == "remove"){
                gold_values[message.guild.id] -= parseInt(args[1])
                messageText += args[1] + " gold removed\n"
            } 
            
            fs.writeFile("assets/gold/gold.json", JSON.stringify(gold_values), function(err) {
                if (err) {
                    console.log(err);
                }
            });
        } 

        messageText += "Your total gold is: " + gold_values[message.guild.id]
        message.channel.send(messageText)
        
        
	},
};