const assert = require("assert")

const { execute } = require("../../commands/monkeyMimics.js")

describe("The monkeyMimics command", function() {
  it("should respond correctly", function() {
    let idealFirstMessage = "Lets play Monkey Mimics!"
    let idealSecondMessage = "Heres your monkey to imitate!"
    let actualMessages = execute({}, [])
    assert.equal(idealFirstMessage, actualMessages[0][0])
    assert.equal(idealSecondMessage, actualMessages[1][0])
  })

  it("should send the 3 monkey images", function() {
    let fileName = /\.\/assets\/monkey-mimics\/[0-9]+.jpeg/g
    let filesString = execute({}, [])[0][1].files.join("")

    let matches = filesString.match(fileName)
    if (matches == null) {
      matches = []
    }
    assert.equal(3, matches.length)
  })

  it("should send a single image privately", function() {
    let fileName = /\.\/assets\/monkey-mimics\/[0-9]+.jpeg/g
    let files = execute({}, [])[1][1].files

    assert.equal(1, files.length)

    let matches = files[0].match(fileName)
    if (matches == null) {
      matches = []
    }
    assert.equal(1, matches.length)
  })

  it("should send an image privately that matches one of the three sent publicly", function() {
    let messages = execute({}, [])
    let files = messages[0][1].files

    let privateFile = messages[1][1].files[0]

    assert.ok(files.includes(privateFile))
  })
})
