const { bulkReply } = require("../functions/bulkMessage.js")

module.exports = {
  name: "jackpot",
  description: "Run this command to try and win the jackpot, currently there's a 1 in 5000 chance of winning. You could also win a spot prize. Roll 0 to win",
  usage: "just send jackpot",
  example: "",
  tested: true,
  execute: async function(message, args) {
    const { bankAccounts } = require("../db/db.js")
    const { transfer } = require("../db/functions/transfer.js")

    const spotPrizes = [1,2,3,4,5,6,7,8,9,10,
      1111,2222,3333,4444,
      1234,2345,3456,4567,
      2468,1357,
      1000,2000,3000,4000,
    ]

    let messageText = ""

    let user = await bankAccounts.findByPk(message.author.id)
    if(user.dataValues.money >= 2){
      let salami = await bankAccounts.findByPk( "637400095821660180" )
      let result = Math.floor(Math.random() * 5000)
      if(result == 0){
        let amount = salami.dataValues.money
        messageText = bulkReply(message, `**YOU WIN!!!!**\nTransferring ${amount} salami to your account!`)
        await transfer(salami,user,amount)
      }
      else if(spotPrizes.includes(result)){
        let amount = (5000-result)*10 + Math.floor(Math.random() * 50)
        amount = salami.dataValues.money < amount ? salami.dataValues.money : amount
        messageText = bulkReply(message, `**SPOT PRIZE!!!!**\nYou rolled ${result}\nTransferring ${amount} salami to your account!`)
        transfer(salami,user,amount)
      }
      else {
        transfer(user,salami,2)
        messageText = bulkReply(message, `you didn't win the jackpot, better luck next time.\nYou rolled ${result}`)
      }
    }
    else{
      messageText = bulkReply(message, "you need at least 2 salami to play")
    }
    return messageText
  },
}