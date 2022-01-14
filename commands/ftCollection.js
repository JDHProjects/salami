const { sendMessage } = require("../functions/sendMessage.js")
const { messagePagination } = require("../functions/messagePagination.js")
const { MessageEmbed } = require("discord.js")
const { MessageAttachment } = require("discord.js")

module.exports = {
  name: "ft-collection",
  description: "Used to display your fungible token (FT) collection",
  usage: "just send ft-collection, there's really not much to this",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { generatedSpacemans, spacemanImages } = require("../db/db.js")

    let spacemen = await generatedSpacemans.findAll({where: {owner_id: message.author.id}})

    if (spacemen.length == 0){
      return await sendMessage.reply(message,"you don't own any FT's")
    }

    let messages = []
    let index = -1
    for (const spaceman of spacemen) {
      index ++
      let attachment = new MessageAttachment(spaceman.dataValues.image,`${index}.png`)
      let ftEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Spaceman ID: ${spaceman.dataValues.id}`)
        .setImage(`attachment://${index}.png`)
        
      messages.push({embeds: [ftEmbed], files:[attachment], attachments: []})
    }
    return await messagePagination(message, messages)
  }
}