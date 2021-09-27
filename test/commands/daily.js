const assert = require("assert")

const { execute } = require("../../commands/daily.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { getUserMoney } = require("../helpers/getUserMoney.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The daily command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it("should respond correctly", async function() {
    await setUserMoney(0)
    let idealMessage = "your 1000 salami have been transferred to your bank account!"
    let actualMessage = (await execute(dummyMessage, [])).content
    assert.equal(actualMessage, idealMessage)
  })

  it("should increment users money by 1000", async function() {
    await setUserMoney(0)
    await execute(dummyMessage, [])[0]
    let money = await getUserMoney()
    assert.equal(1000, money)
  })

  //currently no way to test cooldowns
})
