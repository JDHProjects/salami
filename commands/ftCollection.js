const { sendMessage } = require("../functions/sendMessage.js")
const { messagePagination } = require("../functions/messagePagination.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "ft-collection",
  description: "Used to display your fungible token (FT) collection",
  usage: "just send ft-collection, there's really not much to this",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { spacemanImages } = require("../db/db.js")

    let spacemen = await spacemanImages.findAll({where: {owner_id: message.author.id}})

    if (spacemen.length == 0){
      return await sendMessage.reply(message,"you don't own any FT's")
    }

    let messages = []
    for (const spaceman of spacemen) {
      let ftEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Spaceman ID: ${spaceman.dataValues.id}`)
        .setImage(`attachment://${spaceman.id}.png`)

      messages.push({embeds: [ftEmbed], files: [spaceman.filepath]})
    }
    return await messagePagination(message, messages)
  }
}