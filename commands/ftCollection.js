const { sendMessage } = require("../functions/sendMessage.js")
const { getButtonRow } = require("../functions/getButtonRow.js")
const { getSelectMenu } = require("../functions/getSelectMenu.js")
const { MessageEmbed } = require("discord.js")
const { MessageAttachment } = require("discord.js")

module.exports = {
  name: "ft-collection",
  description: "Used to display your fungible token (FT) collection",
  usage: "just send ft-collection, there's really not much to this",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { generatedSpacemans } = require("../db/db.js")

    let spacemen = await generatedSpacemans.findAll({where: {owner_id: message.author.id}})

    if (spacemen.length == 0){
      return await sendMessage.reply(message,"you don't own any FT's")
    }

    let messages = []
    let listOptions = []
    spacemen.forEach((spaceman, index) => {
      let attachment = new MessageAttachment(spaceman.dataValues.image,`${index}.png`);
      let ftEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${index}`)
        .setImage(`attachment://${index}.png`)
      messages.push({embeds: [ftEmbed], files:[attachment], attachments: []})
      listOptions.push({label: spaceman.dataValues.id, value: `${index}`, description: "A unique spaceman variant", emoji: {name: "🚀",}})
    })
    return await messagePagination(message, messages, listOptions)
  }
}