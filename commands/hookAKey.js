require('dotenv').config();

module.exports = {
	name: 'hook-a-key',
  description: 'Spend 50k salami for a steam game key',
  usage: `Just send hook-a-key, theres not much to this`,
  example: '',
	execute(message, args) {
    var fetchUrl = require("fetch").fetchUrl;
    let fs = require('fs');
    const { bankAccounts, hookAKeys, lossWithTax, sequelize } = require('../db/dbSetup.js')
    if(message.attachments.size == 1){
      if(process.env.OWNER == message.author.id){
        if(message.attachments.first().name.slice(-3) == "txt"){
          fetchUrl(message.attachments.first().url, function(error, meta, body){
            let re = /[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]/g;
            let allKeys = body.toString().match(re);
            let bulkCreator = []
            if (allKeys.length > 0){
              message.reply(`${allKeys.length} key(s) found in sent file`)
              for (i in allKeys){
                bulkCreator.push({
                  key: allKeys[i]
                })
              }
              hookAKeys.bulkCreate(bulkCreator, {ignoreDuplicates: true})
              .then(resp => {
                message.reply(`any non-duplicate keys have been added!`)
              })
            }
            else{
              message.reply(`no keys found in sent file`)
            }
          });
          
        }
        else{
          message.reply(`A new key file must be a .txt file`)
        }
      }
      else {
        message.reply(`Sorry, only admins can add new keys`)
      }
    }
    else{
      bankAccounts.findByPk(message.author.id)
      .then(user => {
        if (user.dataValues.money >= 50000){
          hookAKeys.findOne({ order: sequelize.random(), where: { claimed:  'none' }})
          .then(key => {
            if(key != null){
              lossWithTax(user, 50000)
              key.update({claimed:message.author.id})
              message.author.send(`Enjoy your new game!\nSteam key: ${key.dataValues.key}`);
              message.reply(`key has been sent via DM`)
            }
            else{
              message.reply(`sorry, I'm all out of keys!`)
            }
          })
        }
        else{
          message.reply(`you can't afford a new game`)
        }
      })
    }
		
	},
};