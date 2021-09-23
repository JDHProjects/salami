const assert = require("assert")

const { execute } = require("../../commands/monkeyMimics.js")

describe("The monkeyMimics command", function() {
  it("should respond correctly", async function() {
    let idealFirstMessage = "Lets play Monkey Mimics!"
    let idealSecondMessage = "Heres your monkey to imitate!"
    let actualMessages = (await execute({}, []))
    assert.equal(idealFirstMessage, actualMessages[0][0])
    assert.equal(idealSecondMessage, actualMessages[3][0])
  })

  it("should send the 3 monkey images", async function() {
    let fileName = /\.\/assets\/monkey-mimics\/[0-9]+.jpeg/g
    let command = (await execute({}, []))
    assert.equal(4, command.length)

    let filesString = `${command[0][1].files[0]}${command[1][1].files[0]}${command[2][1].files[0]}`
    let matches = filesString.match(fileName)
    if (matches == null) {
      matches = []
    }
    assert.equal(3, matches.length)
  })

  it("should send a single image privately", async function() {
    let fileName = /\.\/assets\/monkey-mimics\/[0-9]+.jpeg/g
    let files = (await execute({}, []))[1][1].files

    assert.equal(1, files.length)

    let matches = files[0].match(fileName)
    if (matches == null) {
      matches = []
    }
    assert.equal(1, matches.length)
  })

  it("should send an image privately that matches one of the three sent publicly", async function() {
    let messages = (await execute({}, []))
    let files = messages.slice(0,3).map(message => message[1].files[0])

    let privateFile = messages[3][1].files[0]

    assert.ok(files.includes(privateFile))
  })
})
