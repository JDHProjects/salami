const { MessageEmbed } = require("discord.js")
const { searchForImage } = require("../functions/searchForImage.js")
const { parseAndRollDice } = require("../functions/parseAndRollDice.js")
const { checkEmbedLength } = require("../functions/checkEmbedLength.js")
const { Op } = require("sequelize")
const names = require("../assets/monsters/names/names.json")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "monstergen",
  description: "Generates a monster statblock for DND",
  usage: "Supply no args for a random monster. Use a monster name as an arg for a monster matching that name. Use a number as an arg for a monster matching that challenge rating",
  example: "0.25",
  tested: true,
  execute: async function(message, args) {
    const { fiveEMonsters, sequelize } = require("../db/db.js")

    let messageText = {}

    let searchTerm = {order: sequelize.random()}
    if(args.includes("list")){
      messageText = await sendMessage.send(message, names.join("\n"), { split: true })
      return messageText
    }
    if(args.length > 0){
      let joinedArgs = args.join(" ")
      searchTerm = {
        order: sequelize.random(),
        where: { 
          [Op.or]: [ 
            {name: { [Op.like]: joinedArgs }},
            {challenge_rating: joinedArgs }
          ]
        }
      }
    }
    let monster = await fiveEMonsters.findOne(searchTerm)
    if(monster == null){
      messageText = await sendMessage.send(message, "No monster found matching your criteria!")
      return messageText
    }
    message.channel.startTyping()
    let url = await searchForImage(`dnd 5e ${monster.dataValues.name} image`, 0)
    const monsterEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(monster.dataValues.name)
      .setURL(`https://roll20.net/compendium/dnd5e/Monsters:${monster.dataValues.name}`.replaceAll(" ", "%20"))
      .setDescription(`*${monster.dataValues.size} ${monster.dataValues.type}, ${monster.dataValues.alignment}*`)
      .setImage(url)
    if (monster.dataValues.description != null){
      monsterEmbed.addField("\u200b\nDescription", `${monster.dataValues.description}`, false)
    }
    monsterEmbed.addField("\u200b\nStats", `**Armor Class**: ${monster.dataValues.ac} ${monster.dataValues.ac_info != null ? " ("+monster.dataValues.ac_info+")" : ""}
                                          **Hit Points**: ${parseAndRollDice(monster.dataValues.hp_dice)[1]} (Rolled from: ${monster.dataValues.hp_dice})
                                          **Speed**: ${monster.dataValues.speed}`, false)
  
    monsterEmbed.addFields(
      { name: "\u200b\nSTR", value: `${monster.dataValues.str} (${monster.dataValues.str_mod})`, inline: true },
      { name: "\u200b\nDEX", value: `${monster.dataValues.dex} (${monster.dataValues.dex_mod})`, inline: true },
      { name: "\u200b\nCON", value: `${monster.dataValues.con} (${monster.dataValues.con_mod})`, inline: true },
      { name: "INT", value: `${monster.dataValues.int} (${monster.dataValues.int_mod})`, inline: true },
      { name: "WIS", value: `${monster.dataValues.wis} (${monster.dataValues.wis_mod})`, inline: true },
      { name: "CHA", value: `${monster.dataValues.cha} (${monster.dataValues.cha_mod})`, inline: true },
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

    monsterEmbed.addField("\u200b\nStats", misc_info)

    if (monster.dataValues.traits != null){
      checkEmbedLength(monsterEmbed, "\u200b\nTraits", `${monster.dataValues.traits}`)
    }
    if (monster.dataValues.actions != null){
      checkEmbedLength(monsterEmbed, "\u200b\nActions", `${monster.dataValues.actions}`)
    }
    if (monster.dataValues.reactions != null){
      checkEmbedLength(monsterEmbed, "\u200b\nReactions", `${monster.dataValues.reactions}`)
    }
    if (monster.dataValues.legendary_actions != null){
      checkEmbedLength(monsterEmbed, "\u200b\nLegendary Actions", `${monster.dataValues.legendary_actions}`)
    }

    messageText = await sendMessage.send(message, "", { embed: monsterEmbed })
    message.channel.stopTyping()
    return messageText
  },
}
