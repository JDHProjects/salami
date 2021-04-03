module.exports = {
	name: 'fixmoney',
    description: 'Used by an admin to change a users money. + to add, - to remove, = to set equal. Mention the user to change',
    usage: `fixmoney`,
    example: '',
    admin: true,
	execute(message, args) {
        const { bankAccounts, refreshBank } = require('../db/dbSetup.js')
        if (message.mentions.users.size > 0){
            targetUser = message.mentions.users.first()
        }
        else{
            message.reply("No user specified")
            return
        }
        let plus = false
        let minus = false
        let setTo = false
        let amount = -1
        for (i in args){
            if (args[i] == "+"){
                plus = true
            }
            if (args[i] == "-"){
                minus = true
            }
            if (args[i] == "="){
                setTo = true
            }
            else if (!isNaN(parseInt(args[i]))){
                amount = Math.abs(parseInt(args[i]))
            }
        }
        if(!(plus || minus || setTo))
        {
            message.reply("No amount modifier specified")
            return
        }
        if(amount < 0)
        {
            message.reply("No amount specified")
            return
        }
        bankAccounts.findByPk(targetUser.id)
        .then(target => {
            if (plus){
                target.increment('money', {by: amount})
            }
            else if (minus){
                target.decrement('money', {by: amount})
            }
            else if (setTo){
                target.update({money:amount})
            }
            refreshBank()
            message.channel.send(`<@${targetUser.id}>'s money has been updated`)
        })
	},
};