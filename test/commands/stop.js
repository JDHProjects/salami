const assert = require("assert")

const { execute } = require("../../commands/stop.js")

describe("The stop command", function() {
  it("should respond correctly when used", async function() {
    let idealMessage = "Don't tell me what to do"
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
