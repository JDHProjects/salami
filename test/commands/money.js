const assert = require("assert")

const { execute } = require("../../commands/money.js")

const { dummyMessage, dummyMessageWithOtherUserMention } = require("../helpers/dummyMessages.js")
const { setUserMoney } = require("../helpers/setUserMoney.js")
const { getUserMoney } = require("../helpers/getUserMoney.js")

describe("The money command", function() {
  
  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it("should respond correctly when user asks to list money", async function() {
    await setUserMoney(1,2)
    await setUserMoney(1,1)
    await setUserMoney(0)

    let idealMessage = "**Money distribution:**\n1) The Bank : 1000000000 salami\n2) <@2> : 1 salami\n3) <@1> : 1 salami\n4) <@637400095821660180> : 0 salami\n5) <@12345> : 0 salami\n\n**Total salami: 1000000002**"
    let actualMessage = (await execute(dummyMessage, ["list"]))[0]
    
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when user asks to see own balance", async function() {
    await setUserMoney(5678)

    let idealMessage = "you have: 5678 salami"
    let actualMessage = (await execute(dummyMessage, []))[0]
    
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when user tries to transfer more money than they own", async function() {
    await setUserMoney(0)

    let idealMessage = "you don't have enough salami"
    let actualMessage = (await execute(dummyMessageWithOtherUserMention, ["send", "100"]))[0]
    
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when user tries to transfer money to a user that doesn't exist", async function() {
    await setUserMoney(100)

    let idealMessage = "<@2> doesn't have a bank account, the first time they use the bot, one will be generated for them"
    let actualMessage = (await execute(dummyMessageWithOtherUserMention, ["send", "100"]))[0]
    
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when user tries to check another users money", async function() {
    await setUserMoney(0)
    await setUserMoney(0,2)

    let idealMessage = "<@2> has 0 salami"
    let actualMessage = (await execute(dummyMessageWithOtherUserMention, []))[0]
    
    assert.equal(actualMessage, idealMessage)
  })

  it("should respond correctly when user tries to transfer money to another user", async function() {
    await setUserMoney(1000)
    await setUserMoney(0,2)

    let idealMessage = "100 salami transferred from <@12345> to <@2>"
    let actualMessage = (await execute(dummyMessageWithOtherUserMention, ["send", "100"]))[0]
    
    assert.equal(actualMessage, idealMessage)

    assert.equal(await getUserMoney(), 900)
    assert.equal(await getUserMoney(2), 100)
  })
})
