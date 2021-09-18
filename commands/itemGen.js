const { MessageEmbed } = require('discord.js');
const { searchForImage } = require('../functions/searchForImage.js')
const { checkEmbedLength } = require('../functions/checkEmbedLength.js')
const { Op } = require('sequelize');
const names = require('../assets/items/names/names.json');

module.exports = {
	name: 'itemgen',
	description: 'Generates a item statblock for DND',
	usage: 'Supply no args for a random item. Use an item name as an arg for a item matching that name',
	example: '0.25',
	execute(message, args) {
		const { fiveEItems, sequelize } = require('../db/db.js')

		let searchTerm = {order: sequelize.random()}
		if(args.includes("list")){
			message.channel.send(names.join("\n"), { split: true })
			return
		}
		if(args.length > 0){
			let joinedArgs = args.join(" ")
			searchTerm = {
				order: sequelize.random(),
				where: {name: { [Op.like]: joinedArgs }}
			}
		}
		fiveEItems.findOne(searchTerm)
		.then((item) => {
			if(item == null){
				message.channel.send("No item found matching your criteria!");
				return
			}
			message.channel.startTyping();
			searchForImage(`dnd 5e ${item.dataValues.name} image`, 0)
			.then(url => {
				const itemEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(item.dataValues.name)
					.setURL(`https://roll20.net/compendium/dnd5e/Items:${item.dataValues.name}`.replaceAll(" ", "%20").replaceAll("+", "%2B"))
					.setDescription(`*${item.dataValues.type == null ? `` : `${item.dataValues.type}`}${item.dataValues.type != null && item.dataValues.subtype != null ? ` ` : ``}${item.dataValues.subtype == null ? `` : `(${item.dataValues.subtype})`}*`)
					.setImage(url)
					if (item.dataValues.modifiers != null){
						itemEmbed.addField('\u200b\nModifiers', `${item.dataValues.modifiers}`, false)
					}
					if (item.dataValues.weight != null){
						itemEmbed.addField('\u200b\nWeight', `${item.dataValues.weight}`, false)
					}
					if (item.dataValues.damage != null){
						itemEmbed.addField('\u200b\nDamage', `${item.dataValues.damage}`, false)
					}
					if (item.dataValues.damage_type != null){
						itemEmbed.addField('\u200b\nDamage Type', `${item.dataValues.damage_type}`, false)
					}
					if (item.dataValues.properties != null){
						itemEmbed.addField('\u200b\nProperties', `${item.dataValues.properties}`, false)
					}
					if (item.dataValues.range != null){
						itemEmbed.addField('\u200b\nRange', `${item.dataValues.range}`, false)
					}
					if (item.dataValues.duration != null){
						itemEmbed.addField('\u200b\nDuration', `${item.dataValues.duration}`, false)
					}
					if (item.dataValues.ac != null){
						itemEmbed.addField('\u200b\nArmor Class', `${item.dataValues.ac}`, false)
					}
					if (item.dataValues.stealth != null){
						itemEmbed.addField('\u200b\nStealth', `${item.dataValues.stealth}`, false)
					}
					if (item.dataValues.description != null){
						checkEmbedLength(itemEmbed, '\u200b\nDescription', `${item.dataValues.description}`)
					}
				
				message.channel.send({ embed: itemEmbed });
				message.channel.stopTyping();
			})
		}); 
	},
};