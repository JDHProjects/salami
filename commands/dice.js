const { parseAndRollDice } = require("../functions/parseAndRollDice")
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Rolls as many dice as required and adds them up for you')
    .addStringOption(option => 
      option.setName('dice')
        .setDescription('Roll as many dice as you want (with optional modifiers) e.g. 4D20+6 2D6 -20')
        .setRequired(true)),
	async execute(interaction) {
    console.log(interaction.options.getString('dice'))
    let msg = parseAndRollDice(
      interaction.options.getString('dice')
    )
    await interaction.reply(msg[0])
	},
};