const request = require("request")
const names = require('../assets/items/names/names.json');

const create5EItemsJSON = function() {
	return new Promise(function(resolve, reject) {
		let itemPromises = []
		names.forEach(name => {
			itemPromises.push(getItemData(name))
		});
		Promise.all(itemPromises)
		.then(resp => {
			const fs = require('fs');
			fs.writeFile('./assets/items/data/data.json', JSON.stringify(resp, null, 2), err => {
				if (err) {
					console.log(err)
				}
				resolve(`${resp.length} items written to JSON`)
			})
		})
		.catch(err => {
			console.log(err)
		})
	})
};

function getItemData(name) {
	return new Promise(function(resolve, reject) {
		request({url:`https://roll20.net/compendium/dnd5e/${name.replaceAll("+", "%2B")}.json`}, function (error, response, body) {
			let itemJson = JSON.parse(body)

			if(itemJson.data.Category == "Items")
			{
				
				let description = undefined

				cleanContent = itemJson.htmlcontent.replaceAll("\n", "").replaceAll("\t", "").replaceAll("<strong>", "**").replaceAll("</strong>", "**").replaceAll("<br>", "\n").replaceAll("\n\n", "\n").replaceAll("  ", " ").replaceAll("<em>", "").replaceAll("</em>", "").replaceAll("&nbsp;", " ").replaceAll("<p>", "").replaceAll("</p>", "\n").replaceAll("<b>", "**").replaceAll("</b>", "**").replaceAll("<i>", "").replaceAll("</i>", "").replaceAll("<span>", "").replaceAll("</span>", "").replaceAll("<ul>", "").replaceAll("</ul>", "").replaceAll("<li>", "•").replaceAll("</li>", "\n").replaceAll("<div>", "").replaceAll("</div>", "")
				description = cleanContent.replaceAll(/<table>.*<\/table>/g, "Table cannot be displayed, refer to roll20")

				let item = {
					id: itemJson.id,
					name: itemJson.name,
					type:	itemJson.data["Item Type"],
					subtype: itemJson.data.Subtype,
					rarity: itemJson.data["Item Rarity"],
					modifiers: itemJson.data.Modifiers,
					weight: itemJson.data.Weight == undefined ? undefined : parseFloat(itemJson.data.Weight),
					damage: itemJson.data.Damage,
					damage_type: itemJson.data["Damage Type"],
					properties: itemJson.data.Properties,
					range: itemJson.data.Range,
					duration: itemJson.data.Duration,
					ac: itemJson.data["AC"] == undefined ? undefined : parseInt(itemJson.data["AC"]),
					stealth: itemJson.data.Stealth,
					description: description == undefined ? undefined : description.trim(),
				}
				resolve(item)
			}
			else{
				reject(`${name} is not a item`)
			}
		});
	});
}


create5EItemsJSON()
.then(resp => {
	console.log(resp)
})