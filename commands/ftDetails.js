const { sendMessage } = require("../functions/sendMessage.js")
const { MessageEmbed } = require("discord.js")
const { MessageAttachment } = require("discord.js")

module.exports = {
  name: "ft-details",
  description: "Used to display details of your fungible token (FT)",
  usage: "Send ft-details with the id you want to check",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { generatedSpacemans, spacemanImages } = require("../db/db.js")

    if (args.length == 0){
      return await sendMessage.reply(message, "No FT ID provided")
    }

    let spaceman = await generatedSpacemans.findByPk(args[0].toUpperCase())

    if (spaceman == null){
      return await sendMessage.reply(message, "FT ID does not exist")
    }

    let categories = ["backpack", "face", "visor", "chest", "patch", "suit", "ears"]
    let categoriesFormatted = ["Backpack", "Face", "Visor", "Chest", "Patch", "Suit", "Ears"]
    let attachment = new MessageAttachment(spaceman.dataValues.image,`spaceman.png`)
    let ftEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Spaceman ID: ${spaceman.dataValues.id}`)
      .setImage(`attachment://spaceman.png`)
      .setDescription(`Owned by: <@${spaceman.owner_id}>`)
      
    for (let i = 0; i < categories.length; i++){
      let categoryId = `${spaceman.dataValues.id[i*2]}${spaceman.dataValues.id[i*2+1]}`
      let categoryDetails = await spacemanImages.findOne({ where: { category: categories[i], category_id: categoryId }})
      ftEmbed.addField(`**__${categoriesFormatted[i]}__**`,`**Name**: ${categoryDetails.dataValues.name}\n**Description**: ${categoryDetails.dataValues.description}`, false)
    }

    return await  await sendMessage.send(message, "", {embeds: [ftEmbed], files:[attachment], attachments: []})

  }
}