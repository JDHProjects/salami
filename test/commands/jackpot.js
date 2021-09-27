const assert = require("assert")

const { execute } = require("../../commands/jackpot.js")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")
const { getUserMoney } = require("../helpers/getUserMoney.js")

describe("The jackpot command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
    await setUserMoney(1000000, "637400095821660180")
  })

  
  it("should respond correctly with not enough money", async function() {
    await setUserMoney(0)

    let idealMessage = "<@12345>, you need at least 2 salami to play"
    let actualMessage = (await execute(dummyMessage, [])).content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with enough money", async function() {
    await setUserMoney(2)

    let actualMessage = (await execute(dummyMessage, [])).content

    let winMessage = /\*\*YOU WIN!!!!\*\*\nTransferring [0-9]+ salami to your account!/g
    let winMatches = actualMessage.match(winMessage)

    let spotMessage = /\*\*SPOT PRIZE!!!!\*\*\nYou rolled [0-9]+\nTransferring [0-9]+ salami to your account!/g
    let spotMatches = actualMessage.match(spotMessage)

    let lossMessage = /you didn't win the jackpot, better luck next time.\nYou rolled [0-9]+/g
    let lossMatches = actualMessage.match(lossMessage)

    if(winMatches != null){
      assert.equal(1, winMatches.length)
      assert.equal(1000002, await getUserMoney())
      assert.equal(0, await getUserMoney("637400095821660180"))
    }
    else {
      winMatches = []
    }
    if(spotMatches != null){
      assert.equal(1, spotMatches.length)
      assert.notEqual(2, await getUserMoney())
      assert.notEqual(0, await getUserMoney("637400095821660180"))
    }
    else {
      spotMatches = []
    }
    if(lossMatches != null){
      assert.equal(1, lossMatches.length)
      assert.equal(0, await getUserMoney())
      assert.equal(1000002, await getUserMoney("637400095821660180"))
    }
    else {
      lossMatches = []
    }
    assert.equal(1, winMatches.length+spotMatches.length+lossMatches.length)
  })
})
