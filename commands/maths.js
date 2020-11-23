module.exports = {
	name: 'maths',
    description: 'solve a basic maths question to make some money',
    usage: 'just send maths, then send your response as a normal message',
    example: '',
	execute(message, args) {
        const { bankAccounts, sendFromBank } = require('../db/dbSetup.js')

        // `m` is a message object that will be passed through the filter function
        const filter = m => m.author.id === message.author.id;

        const collector = message.channel.createMessageCollector(filter, { time: 15000 });
        
        let operator = Math.floor(Math.random() * 3)
        let operandOne = Math.floor(Math.random() * 20)
        let operandTwo = Math.floor(Math.random() * 20)
        let operatorArray = ["x", "+", "-"]
        let answer = 0
        if(operator == 0){
            answer = operandOne * operandTwo
        }
        else if(operator == 1){
            answer = operandOne + operandTwo
        }
        else if(operator == 2){
            answer = operandOne - operandTwo
        }
        let response = null

        message.reply(`Question: ${operandOne} ${operatorArray[operator]} ${operandTwo}`)
        .then(replyMessage => {
            collector.on('collect', m => { 
                response = parseInt(m.content)
                collector.stop({reason: "user ended"});
            });

            collector.on('end',  (collector, reason) => {
                if (reason == "time"){
                    replyMessage.delete()
                    message.reply("you forgot to answer!")
                }
                else if (isNaN(response)){
                    message.reply("answer not a number")
                }
                else if (response != answer){
                    message.reply(`wrong, the answer was ${answer}`)
                }
                else{
                    let winnings = Math.floor(Math.random() * 29) + 1
                    bankAccounts.findByPk(message.author.id)
                    .then(user => {
                        message.reply(`correct! You win ${winnings} salami!`)
                        sendFromBank(user, winnings)
                    })

                }
            });
        })       
	},
};