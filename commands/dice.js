module.exports = {
	name: 'd',
    description: 'Rolls as many dice as required and adds them up for you',
    usage: '2D6 will roll 2xD6 dice, 1D10 will roll 1xD10 dice etc. Modifier can be added at end with +5 -5 etc. Multiple Dice can be supplied to a single command. Can roll up to 100 dice with a value up to 1 million',
    example: '2D20 1D10 -2',
	execute(message, args) {
        randInt = Math.random();
        msg = '';
        total = 0;
        modifier = 0;
        modifierPolarity = '';

        for (i in args){
            modifierTurn = false;
            if (args[i].includes('D')){
                argArgs = args[i].split('D');
            }
            else if (args[i].includes('d')) {
                argArgs = args[i].split('d');
            }
            else if (args[i].includes('-')){
                modifierTurn = true;
                modifier = -parseInt(args[i].split('-')[1]);
                modifierPolarity = '-';
            }
            else if (args[i].includes('+')){
                modifierTurn = true;
                modifier = parseInt(args[i].split('+')[1]);
                modifierPolarity = '+';
            }
            diceCount = parseInt(argArgs[0]);
            diceValue = parseInt(argArgs[1]);
            diceTotal = 0;
            
            if(argArgs.length === 2 && !modifierTurn && !isNaN(diceCount) && !isNaN(diceValue) && diceValue <= 1000000 && diceValue > 0 && diceCount <= 100 && diceCount > 0){
                for (j = 1; j <= diceCount; j++) {
                    currentDice = Math.floor((Math.random() * diceValue) + 1);
                    diceTotal += currentDice;
                    msg += `${j} D${diceValue}: ${currentDice}\n`;
                }
                total += diceTotal;
                msg += `**${diceCount}D${diceValue} Total: ${diceTotal}**\n\n`;
                  
                
            }
            else if (!modifierTurn) {
                message.channel.send(`Invalid dice format!`);
                return;
            }  
        }

        msg += `**Overall Total: ${total}**\n\n`;    
        if(!isNaN(modifier) && modifier != 0){
            msg += `Modifier: ${modifierPolarity}${Math.abs(modifier)}\n`;
            msg += `**Modifier Adjusted Total: ${total+modifier}**\n\n`;
        }

        message.channel.send(msg, { split: true });
        
	},
};