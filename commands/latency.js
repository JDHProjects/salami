module.exports = {
	name: 'latency',
    description: 'time taken for the bot to see a message and deliver its response to it',
    usage: 'just call latency',
    cooldown: 5,
    example: 'latency',
	execute(message, args) {
        message.channel.send("Latency check!")
        .then(respMessage => {
            messageTime = respMessage.createdTimestamp - message.createdTimestamp
            respMessage.delete()
            message.channel.send("Response Latency: " + messageTime)
        })
    }
};