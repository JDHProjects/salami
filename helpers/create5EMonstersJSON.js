const request = require("request")
const names = require('../assets/monsters/names/names.json');

const create5EMonstersJSON = function() {
	return new Promise(function(resolve, reject) {
		let monsterPromises = []
		names.forEach(name => {
			monsterPromises.push(getMonsterData(name))
		});
		Promise.all(monsterPromises)
		.then(resp => {
			const fs = require('fs');
			fs.writeFile('./assets/monsters/data/data.json', JSON.stringify(resp, null, 2), err => {
				if (err) {
					console.log(err)
				}
				resolve(`${resp.length} Monsters written to JSON`)
			})
		})
		.catch(err => {
			console.log(err)
		})
	})
};

function getMonsterData(name) {
	return new Promise(function(resolve, reject) {
		request({url:`https://roll20.net/compendium/dnd5e/Monsters:${name}.json`}, function (error, response, body) {
			let monsterJson = JSON.parse(body)

			if(monsterJson.data.Category == "Monsters")
			{
				let description = undefined
				let traits = undefined
				let actions = undefined
				let legendaryActions = undefined
				let reactions = undefined

				//needed as roll20 have ONE monster that is formatted with <h3> instead of <h2> (Medusa)
				if (monsterJson.htmlcontent.includes("<h3>")){
					cleanContent = monsterJson.htmlcontent.replaceAll("\n", "").replaceAll("\t", "").replaceAll("<b>", "**").replaceAll(": </b>", "**: ").replaceAll("<p>", "").replaceAll("</p>", "\n").replaceAll("\n\n", "\n").replaceAll("  ", " ")
					contentSplit = cleanContent.split("<h3");

					for (j in contentSplit){
						if (contentSplit[j].includes(">Traits</h3>")){
							traits = contentSplit[j].split("</h3>")[1]
						}
						else if (contentSplit[j].includes(">Actions</h3>")){
							actions = contentSplit[j].split("</h3>")[1]
						}
						else if (contentSplit[j].includes(">Legendary Actions</h3>")){
							legendaryActions = contentSplit[j].split("</h3>")[1]
						}
						else if (contentSplit[j].includes(">Reactions</h3>")){
							reactions = contentSplit[j].split("</h3>")[1]
						}
						else if(contentSplit[j].length > 0){
							description = contentSplit[j]
						}
					}
				}
				else{
					cleanContent = monsterJson.htmlcontent.replaceAll("\n", "").replaceAll("\t", "").replaceAll("<strong>", "**").replaceAll("</strong>", "**").replaceAll("<br>", "\n").replaceAll("\n\n", "\n").replaceAll("  ", " ")
					contentSplit = cleanContent.split("<h2");

					for (j in contentSplit){
						if (contentSplit[j].includes(">Traits</h2>")){
							traits = contentSplit[j].split("</h2>")[1]
						}
						else if (contentSplit[j].includes(">Actions</h2>")){
							actions = contentSplit[j].split("</h2>")[1]
						}
						else if (contentSplit[j].includes(">Legendary Actions</h2>")){
							legendaryActions = contentSplit[j].split("</h2>")[1]
						}
						else if (contentSplit[j].includes(">Reactions</h2>")){
							reactions = contentSplit[j].split("</h2>")[1]
						}
						else if(contentSplit[j].length > 0){
							description = contentSplit[j]
						}
					}
				}
				acAndInfo = monsterJson.data.AC.split(" (", 2)
				hpAndDice = monsterJson.data.HP.split(" (", 2)

				let monster = {
					id: monsterJson.id,
					name: monsterJson.name,
					description: description == undefined ? undefined : description.trim(),
					type: monsterJson.data.Type,
					size: monsterJson.data.Size,
					alignment: monsterJson.data.Alignment,
					ac: acAndInfo[0],
					ac_info: acAndInfo[1] == undefined ? undefined : acAndInfo[1].slice(0,-1),
					average_hp: hpAndDice[0],
					//needed as roll20 have ONE monster that is doesn't have hp dice (Diseased Giant Rat) 
					hp_dice: hpAndDice[1] == undefined ? "2d6" : hpAndDice[1].slice(0,-1),
					speed: monsterJson.data.Speed.trim(),
					str: monsterJson.data["STR"],
					str_mod: monsterJson.data["data-STR-mod"],
					dex: monsterJson.data["DEX"],
					dex_mod: monsterJson.data["data-DEX-mod"],
					con: monsterJson.data["CON"],
					con_mod: monsterJson.data["data-CON-mod"],
					int: monsterJson.data["INT"],
					int_mod: monsterJson.data["data-INT-mod"],
					wis: monsterJson.data["WIS"],
					wis_mod: monsterJson.data["data-WIS-mod"],
					cha: monsterJson.data["CHA"],
					cha_mod: monsterJson.data["data-CHA-mod"],
					saving_throws: monsterJson.data["Saving Throws"] == undefined ? undefined : monsterJson.data["Saving Throws"].trim(),
					skills: monsterJson.data.Skills == undefined ? undefined : monsterJson.data.Skills.trim(),
					damage_immunities: monsterJson.data.Immunities == undefined ? undefined : monsterJson.data.Immunities.trim(),
					damage_resistances: monsterJson.data.Resistances == undefined ? undefined : monsterJson.data.Resistances.trim(),
					damage_vulnerabilities: monsterJson.data.Vulnerabilities == undefined ? undefined : monsterJson.data.Vulnerabilities.trim(),
					condition_immunities: monsterJson.data["Condition Immunities"] == undefined ? undefined : monsterJson.data["Condition Immunities"].trim(),
					senses: (monsterJson.data.Senses == undefined ? "" : monsterJson.data.Senses.trim() + ", ") +`Passive Perception ${monsterJson.data["Passive Perception"]}`,
					languages: monsterJson.data.Languages == undefined ? undefined : monsterJson.data.Languages.trim(),
					challenge_rating: fractionToDecimal(monsterJson.data["Challenge Rating"]),
					challenge_xp: monsterJson.data["data-XP"],
					traits: traits == undefined ? undefined : traits.trim(),
					actions: actions == undefined ? undefined : actions.trim(),
					legendary_actions: legendaryActions == undefined ? undefined : legendaryActions.trim(),
					reactions: reactions == undefined ? undefined : reactions.trim()
				}

				resolve(monster)
			}
			else{
				reject('not a monster')
			}
		});
	});
}

function fractionToDecimal(stringNum){
	let num = 0
	if(stringNum.includes("/")){
		splitString = stringNum.split("/",2)
		let numerator = parseInt(splitString[0])
		let denominator = parseInt(splitString[1])
		if(isNaN(numerator) || isNaN(denominator) || denominator == 0){
			return -1
		}
		return (Math.round((numerator/denominator) * 100) / 100)
	}
 	num = parseInt(stringNum)
	if(isNaN(num)){
		return -1
	}
	return num
}


create5EMonstersJSON()
.then(resp => {
	console.log(resp)
})