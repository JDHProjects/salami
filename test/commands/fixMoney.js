const assert = require("assert")

const { execute } = require("../../commands/fixMoney.js")

const { dummyMessage, dummyMessageWithMention } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")
const { getUserMoney } = require("../helpers/getUserMoney.js")

describe("The fixMoney command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it("should respond correctly with no user", async function() {
    let idealMessage = "No user specified"
    let actualMessage = (await execute(dummyMessage, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with no operator", async function() {
    let idealMessage = "No amount modifier specified"
    let actualMessage = (await execute(dummyMessageWithMention, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with no amount", async function() {
    let idealMessage = "No amount specified"
    let actualMessage = (await execute(dummyMessageWithMention, ["="]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with correct args", async function() {
    await setUserMoney(0)
    
    let idealMessage = "<@12345>'s money has been updated"
    let actualMessage = (await execute(dummyMessageWithMention, ["=", "1000"]))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should set user money correctly", async function() {
    await setUserMoney(0)
    await execute(dummyMessageWithMention, ["=", "1000"])

    let money = await getUserMoney()
    
    assert.equal(1000, money)
  })

  it("should add user money correctly", async function() {
    await setUserMoney(50)
    await execute(dummyMessageWithMention, ["+", "1000"])

    let money = await getUserMoney()
    
    assert.equal(1050, money)
  })

  it("should subtract user money correctly", async function() {
    await setUserMoney(5000)
    await execute(dummyMessageWithMention, ["-", "1000"])

    let money = await getUserMoney()
    
    assert.equal(4000, money)
  })
})
