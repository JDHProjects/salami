const { sequelize } = require('../db/dbSetup.js')
const { MessageEmbed } = require('discord.js');
const { searchForImage } = require('../functions/searchForImage.js')

module.exports = {
	name: 'monstergen',
	description: '',
	usage: '',
    example: '',
	execute(message, args) {
    const { fiveEMonsters } = require('../db/dbSetup.js')
		let msg = ""
		message.channel.startTyping();
		fiveEMonsters.findOne({order: sequelize.random() })
		.then((monster) => {
			searchForImage(`dnd 5e ${monster.dataValues.name}`, 0)
			.then(url => {
				const exampleEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(monster.dataValues.name)
					.setURL(`https://roll20.net/compendium/dnd5e/Monsters:${monster.dataValues.name}`.replaceAll(" ", "%20"))
					.setDescription(`*${monster.dataValues.size} ${monster.dataValues.type}, ${monster.dataValues.alignment}*`)
					.setImage(url)
					if (monster.dataValues.description != null){
						exampleEmbed.addField('Description', `${monster.dataValues.description}`, false)
					}
					exampleEmbed.addField('Stats', `**Armor Class**: ${monster.dataValues.ac} ${monster.dataValues.ac_info != null ? " ("+monster.dataValues.ac_info+")" : ""}
																					**Hit Points**: ${monster.dataValues.average_hp} (${monster.dataValues.hp_dice})
																					**Speed**: ${monster.dataValues.speed}`, false)
					
					exampleEmbed.addFields(
						{ name: 'STR', value: `${monster.dataValues.str} (${monster.dataValues.str_mod})`, inline: true },
						{ name: 'DEX', value: `${monster.dataValues.dex} (${monster.dataValues.dex_mod})`, inline: true },
						{ name: 'CON', value: `${monster.dataValues.con} (${monster.dataValues.con_mod})`, inline: true },
						{ name: 'INT', value: `${monster.dataValues.int} (${monster.dataValues.int_mod})`, inline: true },
						{ name: 'WIS', value: `${monster.dataValues.wis} (${monster.dataValues.wis_mod})`, inline: true },
						{ name: 'CHA', value: `${monster.dataValues.cha} (${monster.dataValues.cha_mod})`, inline: true },
					)
				
				let misc_info = ""
				misc_info += `${monster.dataValues.saving_throws != null ? `**Saving Throws**: ${monster.dataValues.saving_throws}\n` : ""}`
				misc_info += `${monster.dataValues.skills != null ? `**Skills**: ${monster.dataValues.skills}\n` : ""}`
				misc_info += `${monster.dataValues.damage_immunities != null ? `**Damage Immunities**: ${monster.dataValues.damage_immunities}\n` : ""}`
				misc_info += `${monster.dataValues.damage_resistances != null ? `**Damage Resistances**: ${monster.dataValues.damage_resistances}\n` : ""}`
				misc_info += `${monster.dataValues.damage_vulnerabilities != null ? `**Damage Vulnerabilites**: ${monster.dataValues.damage_vulnerabilities}\n` : ""}`
				misc_info += `${monster.dataValues.condition_immunities != null ? `**Condition Immunities**: ${monster.dataValues.condition_immunities}\n` : ""}`
				misc_info += `${monster.dataValues.senses != null ? `**Senses**: ${monster.dataValues.senses}\n` : ""}`
				misc_info += `${monster.dataValues.languages != null ? `**Languages**: ${monster.dataValues.languages}\n` : ""}`
				misc_info += `${`**Challenge Rating**: ${monster.dataValues.challenge_rating} (${monster.dataValues.challenge_xp} XP)\n`}`

				exampleEmbed.addField('Stats', misc_info)

				if (monster.dataValues.traits != null){
					exampleEmbed.addField('Traits', `${monster.dataValues.traits}`, false)
				}
				if (monster.dataValues.actions != null){
					exampleEmbed.addField('Actions', `${monster.dataValues.actions}`, false)
				}
				if (monster.dataValues.reactions != null){
					exampleEmbed.addField('Reactions', `${monster.dataValues.reactions}`, false)
				}
				if (monster.dataValues.legendary_actions != null){
					exampleEmbed.addField('Legendary Actions', `${monster.dataValues.legendary_actions}`, false)
				}
				
				message.channel.send({ embed: exampleEmbed });
				message.channel.stopTyping();
			})
		}); 
	},
};