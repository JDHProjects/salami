const { EmbedBuilder } = require("discord.js")
const { searchForImage } = require("../functions/searchForImage.js")
const { checkEmbedLength } = require("../functions/checkEmbedLength.js")
const { Op } = require("sequelize")
const names = require("../assets/items/names/names.json")

const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  display: "DND Item Generator",
  name: "itemgen",
  description: "Generates a item statblock for DND",
  usage: "Supply no args for a random item. Use an item name as an arg for a item matching that name",
  example: "0.25",
  tested: true,
  execute: async function(message, args) {
    const { fiveEItems, sequelize } = require("../db/db.js")

    let messageText = {}

    let searchTerm = {order: sequelize.random()}
    if(args.includes("list")){
      messageText = await sendMessage.splitSend(message, names.join("\n"))
      return messageText
    }
    if(args.length > 0){
      let joinedArgs = args.join(" ")
      searchTerm = {
        order: sequelize.random(),
        where: {name: { [Op.like]: joinedArgs }}
      }
    }
    let item = await fiveEItems.findOne(searchTerm)
    if(item == null){
      messageText = await sendMessage.send(message, "No item found matching your criteria!")
      return messageText
    }
    message.channel.sendTyping()
    let url = await searchForImage(`dnd 5e ${item.dataValues.name} image`, 0)
    const itemEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(item.dataValues.name)
      .setURL(`https://roll20.net/compendium/dnd5e/Items:${item.dataValues.name}`.replaceAll(" ", "%20").replaceAll("+", "%2B"))
      .setDescription(`*${item.dataValues.type == null ? "" : `${item.dataValues.type}`}${item.dataValues.type != null && item.dataValues.subtype != null ? " " : ""}${item.dataValues.subtype == null ? "" : `(${item.dataValues.subtype})`}*`)
      .setImage(url)
    if (item.dataValues.modifiers != null){
      itemEmbed.addFields({name:"\u200b\nModifiers", value:`${item.dataValues.modifiers}`, inline:false})
    }
    if (item.dataValues.weight != null){
      itemEmbed.addFields({name:"\u200b\nWeight", value:`${item.dataValues.weight}`, inline:false})
    }
    if (item.dataValues.damage != null){
      itemEmbed.addFields({name:"\u200b\nDamage", value:`${item.dataValues.damage}`, inline:false})
    }
    if (item.dataValues.damage_type != null){
      itemEmbed.addFields({name:"\u200b\nDamage Type", value:`${item.dataValues.damage_type}`, inline:false})
    }
    if (item.dataValues.properties != null){
      itemEmbed.addFields({name:"\u200b\nProperties", value:`${item.dataValues.properties}`, inline:false})
    }
    if (item.dataValues.range != null){
      itemEmbed.addFields({name:"\u200b\nRange", value:`${item.dataValues.range}`, inline:false})
    }
    if (item.dataValues.duration != null){
      itemEmbed.addFields({name:"\u200b\nDuration", value:`${item.dataValues.duration}`, inline:false})
    }
    if (item.dataValues.ac != null){
      itemEmbed.addFields({name:"\u200b\nArmor Class", value:`${item.dataValues.ac}`, inline:false})
    }
    if (item.dataValues.stealth != null){
      itemEmbed.addFields({name:"\u200b\nStealth", value:`${item.dataValues.stealth}`, inline:false})
    }
    if (item.dataValues.description != null){
      checkEmbedLength(itemEmbed, "\u200b\nDescription", `${item.dataValues.description}`)
    }

    messageText = await sendMessage.send(message, "", { embeds: [itemEmbed] })
    return messageText
  },
}