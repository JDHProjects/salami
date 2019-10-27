module.exports = {
	name: 'd',
    description: 'Rolls as many dice as required and adds them up for you',
    usage: '2D6 will roll 2xD6 dice, 1D10 will roll 1xD10 dice etc. Multiple Dice can be supplied to a single command',
    example: '2D20 1D10',
	execute(message, args) {
        randInt = Math.random();
        msg = '';
        total = 0;

        for (i in args){
            if (args[i].includes('D')){
                argArgs = args[i].split('D');
            }
            else {
                argArgs = args[i].split('d');
            }
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
        message.channel.send(msg, { split: true });
        
	},
};