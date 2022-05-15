const { sendMessage } = require("../functions/sendMessage.js")
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "ft-details",
  description: "Used to display details of your fungible token (FT)",
  usage: "Send ft-details with the id you want to check",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { spacemanLayers, spacemanImages } = require("../db/db.js")

    if (args.length == 0){
      return await sendMessage.reply(message, "No FT ID provided")
    }

    let spaceman = await spacemanImages.findByPk(args[0].toUpperCase())

    if (spaceman == null){
      return await sendMessage.reply(message, "FT ID does not exist")
    }

    let layers = ["backpack", "face", "visor", "chest", "patch", "suit", "ears"]
    let layersFormatted = ["Backpack", "Face", "Visor", "Chest", "Patch", "Suit", "Ears"]
    let ftEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Spaceman ID: ${spaceman.dataValues.id}`)
      .setImage(`attachment://${spaceman.id}.png`)
      
    let splitId = spaceman.dataValues.id.match(/[A-F0-9][A-F0-9]/g)
    for (let i = 0; i < layers.length; i++){
      let layerDetails = await spacemanLayers.findOne({ where: { layer: layers[i], layer_id: splitId[i] }})
      ftEmbed.addField(`**__${layersFormatted[i]}__**`,`**Name**: ${layerDetails.dataValues.name}\n**Description**: ${layerDetails.dataValues.description}`, false)
    }

    return await sendMessage.reply(message, "", {embeds: [ftEmbed], files: [spaceman.filepath]})
  }
}