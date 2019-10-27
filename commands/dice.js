module.exports = {
	name: 'd',
	description: 'Rolls any dice',
	execute(message, args) {
        randInt = Math.random();
        msg = '';
        total = 0;
        //intArray
        for (i in args){
            argArgs = args[i].split('D');
            diceCount = parseInt(argArgs[0]);
            diceValue = parseInt(argArgs[1]);
            diceTotal = 0;
            
            if(argArgs.length === 2 && !isNaN(diceCount) && !isNaN(diceValue)){
                for (j = 1; j <= diceCount; j++) {
                    currentDice = Math.floor((Math.random() * diceValue) + 1);
                    diceTotal += currentDice;
                    msg += `${j} D${diceValue}: ${currentDice}\n`;
                }
                total += diceTotal;
                msg += `**${diceCount}D${diceValue} Total: ${diceTotal}**\n\n`;
                  
                
            }
            else{
                message.channel.send(`Invalid dice format!`);
                return;
            }  
        }
        msg += `**Overall Total: ${total}**\n\n`;
        message.channel.send(msg);
        
	},
};