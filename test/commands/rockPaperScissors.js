const assert = require("assert")

const { execute } = require("../../commands/rockPaperScissors.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The rps command", function() {
  it("should respond correctly when user has insufficient money", async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await setUserMoney(0)
    await refreshBank()

    let idealMessage = "you don't have enough salami to make that bet"
    let actualMessage = (await execute(dummyMessage, ["100"])).content

    assert.equal(idealMessage, actualMessage)
  })
})
