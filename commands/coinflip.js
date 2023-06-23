const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin, guess on the result, you can even bet on the result if you want')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Your guess')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: "Heads" },
          { name: 'Tails', value: "Tails" },
        ))
    .addIntegerOption(option => 
      option.setName('bet')
        .setDescription('Your (optional) bet')
        .setMinValue(1)),
	async execute(interaction) {
    const { bankAccounts } = require("../db/db.js")
    const { lossWithTax } = require("../db/functions/lossWithTax.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")

    const coinLookup = ["Heads", "Tails"]

    let amount = interaction.options.getInteger('bet')

    if(amount != null){
      user = await bankAccounts.findByPk(interaction.user.id)
      if (amount > user.dataValues.money){
        return await interaction.reply("You don't have enough salami to make that bet")
      }
    }

    let flip = coinLookup[Math.floor(Math.random() * 2)]
    if(flip == interaction.options.getString('choice')){
      await interaction.reply(`${flip}, you win!`)
      if (amount != null){
        await sendFromBank(user, amount)
      }
    }
    else{
      await interaction.reply(`${flip}, you lose`)
      if (amount != null){
        await lossWithTax(user, amount)
      }
    }
	},
};