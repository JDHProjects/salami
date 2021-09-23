const assert = require("assert")

const { dummyMessage } = require("../helpers/dummyMessages.js")

const { execute } = require("../../commands/wildSurge.js")

describe("The wildSurge command", function() {
  it("should respond correctly when used", async function() {
    let idealMessage = /you rolled [0-9]+: .+/g
    let actualMessage = (await execute(dummyMessage, []))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })
})
