module.exports = {
	name: 'dbbackup',
	description: 'ADMIN ONLY COMMAND to backup database',
    usage: `ADMIN ONLY`,
    example: 'dbbackup',
    admin: true,
	execute(message, args) {
    message.author.send("DB backup file", { files: ["../database.sqlite"] });
  }
};