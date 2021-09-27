const assert = require("assert")

const { execute } = require("../../commands/dicegame.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The dicegame command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it("should respond correctly with no guess", async function() {
    let idealMessage = "you forgot to make a guess!"
    let actualMessage = (await execute({}, [])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with a one guess", async function() {
    await setUserMoney(0)

    let idealMessage = /(one|two|three|four|five|six)! <@12345>, (you lose|you win!)/g
    let actualMessage = (await execute(dummyMessage, ["one"])).content
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })

  it("should respond correctly when user has insufficient money", async function() {
    await setUserMoney(0)

    let idealMessage = "you don't have enough salami to make that bet"
    let actualMessage = (await execute(dummyMessage, ["one", "100"])).content
    
    assert.equal(idealMessage, actualMessage)
  })
})
