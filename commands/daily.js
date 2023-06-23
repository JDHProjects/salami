const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Gives you 1000 salami once every 24 hours'),
  cooldown: 86400,
	async execute(interaction) {
    const { bankAccounts } = require("../db/db.js")
    const { sendFromBank } = require("../db/functions/sendFromBank.js")
			
    let user = await bankAccounts.findByPk(message.author.id)

    sendFromBank(user, 1000)
    interaction.reply("your 1000 salami have been transferred to your bank account!")
	},
};