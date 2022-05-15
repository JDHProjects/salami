const { sendMessage } = require("../functions/sendMessage.js")
const { generateSpaceman } = require("../functions/generateSpaceman.js")
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "mint-ft",
  description: "Used to mint a spaceman fungible token (FT)",
  usage: "just send mint-ft, there's really not much to this",
  example: "",
  tested: false,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")

    let user = await bankAccounts.findByPk(message.author.id)
    if (20000 > user.dataValues.money){
      return await sendMessage.reply(message,"you don't have enough salami to mint a spaceman FT")
    }
    let spaceman = await generateSpaceman(message.author.id)
    lossWithTax(user, 20000)

    let ftEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Spaceman ID: ${spaceman.id}`)
      .setImage(`attachment://${spaceman.id}.png`)
      .setDescription(`Owned by: <@${spaceman.owner_id}>`)

    return await  await sendMessage.reply(message, "Here's your spaceman!", {embeds: [ftEmbed], files: [spaceman.filepath]})
  }
}