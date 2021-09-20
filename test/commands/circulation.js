const assert = require("assert")

const { setUserMoney } = require("../helpers/setUserMoney.js")

const { execute } = require("../../commands/circulation.js")

describe("The circulation command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it("should respond correctly when no money in circulation", async function() {
    let idealMessage = /The current amount of salami in user circulation on [0-9A-Za-z,: ]+ is:\n\*\*0 salami\*\*\n<@637400095821660180> owns 0% of the salami in circulation/g
    let actualMessage = (await execute({}, []))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })

  it("should respond correctly when money in circulation", async function() {
    await setUserMoney(1)

    let idealMessage = /The current amount of salami in user circulation on [0-9A-Za-z,: ]+ is:\n\*\*1 salami\*\*\n<@637400095821660180> owns 0% of the salami in circulation/g
    let actualMessage = (await execute({}, []))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })
})
