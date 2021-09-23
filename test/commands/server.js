const assert = require("assert")

const { execute } = require("../../commands/server.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")

describe("The server command", function() {
  it("should respond correctly when used not in a guild", async function() {
    let idealMessage = "You're not in a server!"
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when used in a guild", async function() {
    let idealMessage = "Server name: valid_guild\nTotal members: 0\nServer Owner: <@12345>\nCurrent Host Region: valid_region\nEstablished: valid_time"
    let actualMessage = (await execute(dummyMessage, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
