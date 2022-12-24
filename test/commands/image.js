const assert = require("assert")

const { execute } = require("../../commands/image.js")

describe("The image command", function() {

  it("should respond correctly to a user trying to provide no args", async function() {
    let idealMessage = "No search term provided!"
    let actualMessage = (await execute({}, [])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a user searching for an image", async function() {
    let idealMessage = /http[s]?:\/\//g
    let actualMessage = (await execute({}, ["test"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(matches.length, 1)
  })

  it("should respond correctly to a user searching for an image with a different index", async function() {
    let messageOne = (await execute({}, ["test"])).content
    let messageTwo = (await execute({}, ["test","1"])).content
    
    assert.notEqual(messageOne, messageTwo)
  })
})
