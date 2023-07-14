const parseAndRollDice = function(diceString) {
  let overallTotal = 0
  let overallModifier = 0
  let msg = ""
  let diceRegex = /\d+[d]\d+([-+]\d+)?/g
  let soloModifierRegex = /\B[-+]\d+/g
  let allDice = diceString.match(diceRegex)
  let endModifier = diceString.match(soloModifierRegex)

  if (allDice.length > 10){
    return ["Too many dice provided!", -1]
  }

  for (let i in allDice){
    let diceTotal = 0
    let countAndDice = allDice[i].split("d")
    let count = countAndDice[0]
    let dice = countAndDice[1]
    let modifier = 0

    if (countAndDice[1].includes("+")){
      let diceAndModifier = countAndDice[1].split("+")
      dice = diceAndModifier[0]
      modifier = parseInt(diceAndModifier[1])
    }
    else if (countAndDice[1].includes("-")){
      let diceAndModifier = countAndDice[1].split("-")
      dice = diceAndModifier[0]
      modifier = -parseInt(diceAndModifier[1])
    }

    if(count > 10 || dice > 1000000){
      return ["Dice too large to roll!", -1]
    }

    for (let j = 1; j <= count; j++) {
      let currentDice = Math.floor((Math.random() * dice) + 1)
      diceTotal += currentDice
      msg += `${j} D${dice}: ${currentDice}\n`
    }

    if (modifier != 0){
      msg += `*Modifier: ${modifier > 0 ? "+" : ""}${modifier}*\n`
      diceTotal += modifier
    }

    overallTotal += diceTotal
    msg += `**${allDice[i].toUpperCase()} Total: ${diceTotal}**\n\n`
    
  }

  if (endModifier != null){
    console.log(endModifier[0])
    if (endModifier[0].includes("+")){
      overallModifier = parseInt(endModifier[0].slice(1))
    }
    else if (endModifier[0].includes("-")){
      overallModifier = -parseInt(endModifier[0].slice(1))
    }
    msg += `*Overall Modifier: ${overallModifier > 0 ? "+" : ""}${overallModifier}*\n`
  }

  msg += `**Overall Total: ${overallTotal+overallModifier}**\n\n`
	
  return [msg, overallTotal+overallModifier]
}

module.exports = { parseAndRollDice }