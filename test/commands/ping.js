const assert = require("assert")

const { execute } = require("../../commands/ping.js")

describe("The ping command", function() {
  it("should respond correctly when used", async function() {
    let idealMessage = "Pong!"
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
