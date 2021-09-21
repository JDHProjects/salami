const assert = require("assert")

const { execute } = require("../../commands/heist.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The heist command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it("should respond correctly with not enough money", async function() {
    await setUserMoney(0)

    let idealMessage = "you need 1000 salami to buy the heist equipment!"
    let actualMessage = (await execute(dummyMessage, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with enough money", async function() {
    await setUserMoney(1000)

    let idealMessage = /you were caught!|you escaped with [0-9]+ salami!/g
    let actualMessage = (await execute(dummyMessage, []))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })
})
