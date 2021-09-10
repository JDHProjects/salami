const parseAndRollDice = function(diceString) {
	let overallTotal = 0
	let modifierTotal = 0
	let msg = ""
	let diceRegex = /\d+[d]\d+/g;
	let modifierRegex = /[-+]\d+/g;
  let allDice = diceString.match(diceRegex);
	let allModifiers = diceString.match(modifierRegex);
	
	for (i in allDice){
		let diceTotal = 0
		let countAndDice = allDice[i].split("d")
		if(countAndDice[0] > 100 || countAndDice[1] > 1000000){
			return ["Dice too large to roll!", -1]
		}
		
		for (j = 1; j <= countAndDice[0]; j++) {
			let currentDice = Math.floor((Math.random() * countAndDice[1]) + 1);
			diceTotal += currentDice;
			msg += `${j} D${countAndDice[1]}: ${currentDice}\n`;
		}
		overallTotal += diceTotal;
    msg += `**${countAndDice[0]}D${countAndDice[1]} Total: ${diceTotal}**\n\n`;
	}
	msg += `**Overall Total: ${overallTotal}**\n\n`; 

	for (i in allModifiers){
		if (allModifiers[i][0] == '+') {
			modifierTotal += parseInt(allModifiers[i].slice(1))
		}
		else if (allModifiers[i][0] == '-') {
			modifierTotal -= parseInt(allModifiers[i].slice(1))
		}
	}
	msg += `Overall Modifier: ${modifierTotal > 0 ? "+" : ""}${modifierTotal}\n`;
	msg += `**Modifier Adjusted Total: ${overallTotal+modifierTotal}**\n\n`;
	
	return [msg, overallTotal+modifierTotal]
};

module.exports = { parseAndRollDice };