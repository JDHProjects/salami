const assert = require("assert")

const { execute } = require("../../commands/pong.js")

describe("The pong command", function() {
  it("should respond correctly when used", async function() {
    let idealMessage = "Wrong way round idiot!"
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
