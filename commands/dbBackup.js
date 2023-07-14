const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dbbackup')
		.setDescription('Backup database by sending a copy of the database file to your private messages'),
  admin: true,
	async execute(interaction) {
		await interaction.reply({ content: "DB backup file", files: ["./database.sqlite"], ephemeral: true });
	},
};
