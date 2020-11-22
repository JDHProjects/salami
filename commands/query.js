module.exports = {
	name: 'query',
    description: 'Sends a query to the database',
    usage: `query with sql query after`,
    example: '',
    admin: true,
	execute(message, args) {
        const { sequelize } = require('../db/dbSetup.js')

        querystring = ""
        for (i in args){
            querystring += args[i]
            if (i < args.length -1){
                querystring += " "
            }
        }
        message.author.send("DB backup file", { files: ["./database.sqlite"] });
        sequelize.query(querystring)
        .then( resp => {
            message.channel.send(`query: ${querystring} is complete`)
        })
	},
};