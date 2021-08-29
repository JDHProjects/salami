module.exports = {
	name: 'dbbackup',
	description: 'Used to backup database by sending a copy of the database file to your private messages',
    usage: `just send dbbackup, theres really not much to this`,
    example: 'dbbackup',
    admin: true,
	execute(message, args) {
    message.author.send("DB backup file", { files: ["./database.sqlite"] });
  }
};