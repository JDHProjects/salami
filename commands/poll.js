questions = ["1️⃣", 
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟"]

module.exports = {
	name: 'poll',
    description: 'create a poll that users can react to in order to vote',
    usage: 'poll create to create a poll (optional extra argument for poll duration in seconds, max 30 minutes)',
    example: 'poll create 120',
	execute(message, args) {
        if (args[0] != undefined && args[0].toLowerCase() == "create"){
            let msg = '';
            let counter = -1;
            let currentMessage = null;
            let timeLimit = 60000;
            if (args[1] != undefined && !isNaN(parseInt(args[1])) && parseInt(args[1]) <= 1800){
                timeLimit = parseInt(args[1]) * 1000;
            }

            // `m` is a message object that will be passed through the filter function
            const filter = m => m.author.id === message.author.id;

            const collector = message.channel.createMessageCollector(filter, { time: 15000 });

            message.channel.send("Please input poll title: ")
            .then(message => {
                currentMessage = message;
            })

            collector.on('collect', m => {
                if(m.content.toLowerCase() == "done"){
                    currentMessage.delete()
                    m.delete() 
                    collector.stop({reason: "user ended"});
                }
                else if (counter < questions.length) {
                    if (counter < 0){
                        msg += "**"+m.content+"**\n\n";
                    }
                    else {
                        msg += questions[counter] + " : " + m.content + "\n\n";
                    }
                    currentMessage.delete()
                    m.delete() 
                    message.channel.send("Please input poll option "+(counter+2)+":\n(or \"done\" if finished) ")
                    .then(message => {
                        currentMessage = message;
                    })
                    
                    counter++;
                    collector.resetTimer({time: 15000})
                }
                else{
                    collector.stop({reason: "out of questions"});
                }  
            });

            collector.on('end',  (collector, reason) => {
                if (reason == "time"){
                    currentMessage.delete()
                    message.channel.send("timeout!")
                }
                else{
                    msg+="**Choose your answer from the reactions below!**"
                    message.channel.send(msg)
                        .then(message => {
                            reactResults(message, timeLimit, counter)
                        })
                }
                
            });
        }
        
	},
};

function reactResults(message, timeLimit, counter){
    for (i = 0; i < counter; i++){
        message.react(questions[i])
    }
    const filter = (reaction) => {
        return questions.includes(reaction.emoji.name)
    };
    
    const collector = message.createReactionCollector(filter, { time: timeLimit });
    
    
    collector.on('end', collected => {
        let maxKey = 0;
        let maxValue = 0;
        let draw = false;
        for (let [key, value] of collected){
            if (value.count > maxValue){
                maxValue = value.count;
                maxKey = key;
            }
            else if (value.count == maxValue) {
                draw = true;
            }
        }
        if (maxValue == 1) {
            message.channel.send("Noone voted :(")
        }
        else if(draw){
            message.channel.send("It's a draw!")
        }
        else {
            message.channel.send("The winner is...\n"+maxKey+" with "+(maxValue-1)+" user votes!")
        }
    });
}