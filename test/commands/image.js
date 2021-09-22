const assert = require("assert")

const { execute } = require("../../commands/image.js")

describe("The image command", function() {

  it("should respond correctly to a user trying to provide no args", async function() {
    let idealMessage = "No search term provided!"
    let actualMessage = (await execute({}, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a user searching for an image", async function() {
    this.timeout(5000)
    let idealMessage = /http[s]?:\/\//g
    let actualMessage = (await execute({}, ["test"]))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(matches.length, 1)
  })

  it("should respond correctly to a user searching for an image with a different index", async function() {
    this.timeout(5000)
    let messageOne = (await execute({}, ["test"]))[0]
    let messageTwo = (await execute({}, ["test","1"]))[0]
    
    assert.notEqual(messageOne, messageTwo)
  })
})