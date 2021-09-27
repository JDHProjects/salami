const { sendMessage } = require("../functions/sendMessage.js")

module.exports = {
  name: "monkey-mimics",
  description: "Sends 3 different images of monkeys to the channel, and one to the user privately. Imitate the noise you think your secret monkey would make and see if anyone can guess which monkey you're mimicking",
  usage: "Just send monkey-mimics, theres really not much to this",
  example: "",
  tested: true, 
  execute: async function(message, args) {
    let messages = []
    let photoCount = 257
    let monkeyNums = [0,0,0]
    monkeyNums[0] = Math.floor((Math.random() * photoCount) + 1)
    do {
      monkeyNums[1] = Math.floor((Math.random() * photoCount) + 1)
    } while (monkeyNums[1] === monkeyNums[0])
    do {
      monkeyNums[2] = Math.floor((Math.random() * photoCount) + 1)
    } while (monkeyNums[2] === monkeyNums[0] || monkeyNums[2] === monkeyNums[1])

    messages.push(await sendMessage.send(message,{ content: "Lets play Monkey Mimics!",
      files: [
        "./assets/monkey-mimics/"+monkeyNums[0]+".jpeg",
      ]
    }))
    messages.push(await sendMessage.send(message, {
      files: [
        "./assets/monkey-mimics/"+monkeyNums[1]+".jpeg",
      ]
    }))
    messages.push(await sendMessage.send(message, {
      files: [
        "./assets/monkey-mimics/"+monkeyNums[2]+".jpeg",
      ]
    }))
    messages.push(await sendMessage.author(message, {content: "Heres your monkey to imitate!",
      files: [
        "./assets/monkey-mimics/"+monkeyNums[Math.floor(Math.random() * monkeyNums.length)]+".jpeg"
      ]
    }))
    return messages
  },
}