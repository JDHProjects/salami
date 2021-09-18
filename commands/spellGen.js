const { MessageEmbed } = require('discord.js');
const { checkEmbedLength } = require('../functions/checkEmbedLength.js')
const { Op } = require('sequelize');
const names = require('../assets/spells/names/names.json');

module.exports = {
	name: 'spellgen',
	description: 'Generates a spell statblock for DND',
	usage: 'Supply no args for a random spell. Use a spell name as an arg for a spell matching that name. Use a number as an arg for a spell matching that level',
	example: '2',
	execute(message, args) {
		const { fiveESpells, sequelize } = require('../db/db.js')

		let searchTerm = {order: sequelize.random()}
		if(args.includes("list")){
			message.channel.send(names.join("\n"), { split: true })
			return
		}
		if(args.length > 0){
			let joinedArgs = args.join(" ")
			searchTerm = {
				order: sequelize.random(),
				where: { 
					[Op.or]: [ 
						{name: { [Op.like]: joinedArgs }},
						{level: joinedArgs }
					]
				}
			}
		}
		fiveESpells.findOne(searchTerm)
		.then((spell) => {
			if(spell == null){
				message.channel.send("No spell found matching your criteria!");
				return
			}
			message.channel.startTyping();
			const spellEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(spell.dataValues.name)
				.setURL(`https://roll20.net/compendium/dnd5e/${spell.dataValues.name == "Shield" ? "Spells:Shield" : spell.dataValues.name}`.replaceAll(" ", "%20"))
				.setDescription(`*${spell.dataValues.level == 0 ? `cantrip,` : `level ${spell.dataValues.level},`} ${spell.dataValues.school}*`)
				
				spellEmbed.addField('\u200b\nCasting Time', `${spell.dataValues.casting_time}`, false)
				spellEmbed.addField('\u200b\nRange', `${spell.dataValues.range}`, false)
				spellEmbed.addField('\u200b\nComponents', `${spell.dataValues.components} ${spell.dataValues.materials == null ? "" : `(${spell.dataValues.materials})`}`, false)
				spellEmbed.addField('\u200b\nDuration', `${spell.dataValues.duration}`, false)
				spellEmbed.addField('\u200b\nClasses', `${spell.dataValues.classes}`, false)
				checkEmbedLength(spellEmbed, '\u200b\nDescription', `${spell.dataValues.description}`)
				if (spell.dataValues.higher_level != null){
					checkEmbedLength(spellEmbed, '\u200b\nHigher Level', `${spell.dataValues.higher_level}`)
				}
			
			message.channel.send({ embed: spellEmbed });
			message.channel.stopTyping();
		})
	},
};