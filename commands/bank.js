const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bank')
		.setDescription('Check the amount the central bank has'),
	async execute(interaction) {
    const { bankAccounts } = require("../db/db.js")
    let bank = await bankAccounts.findByPk("0")
    let total = await bankAccounts.sum("money")

		await interaction.reply(`The bank currently holds:
    **${bank.dataValues.money} salami**
    Which is ${Math.floor((bank.dataValues.money/total)*100)}% of the total market`);
	},
};
