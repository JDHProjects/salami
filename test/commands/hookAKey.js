const assert = require("assert")

const { execute } = require("../../commands/hookAKey.js")

const { dummyMessage, dummyMessageWithAttachment, dummyMessageWithJPEGAttachmentAsAdmin, dummyMessageWithNoKeysAttachmentAsAdmin, dummyMessageWithKeysAttachmentAsAdmin } = require("../helpers/dummyMessages.js")

const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The hookAKey command", function() {

  beforeEach(async function() {
    const { refreshBank } = require("../../db/functions/refreshBank.js")
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it("should respond correctly to a non-admin trying to add keys", async function() {
    let idealMessage = "Sorry, only admins can add new keys"
    let actualMessage = (await execute(dummyMessageWithAttachment, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to an admin trying to send a non .txt file", async function() {
    let idealMessage = "A new key file must be a .txt file"
    let actualMessage = (await execute(dummyMessageWithJPEGAttachmentAsAdmin, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to an admin trying to send a .txt file with no keys", async function() {
    let idealMessage = "no keys found in sent file"
    let actualMessage = (await execute(dummyMessageWithNoKeysAttachmentAsAdmin, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to an admin adding a key from a .txt file", async function() {
    let idealFirstMessage = "1 key(s) found in sent file"
    let idealSecondMessage = "any non-duplicate keys have been added!"
    let actualMessages = (await execute(dummyMessageWithKeysAttachmentAsAdmin, []))
    assert.equal(idealFirstMessage, actualMessages[0].content)
    assert.equal(idealSecondMessage, actualMessages[1].content)
  })

  it("should respond correctly to a user not having enough money for a game", async function() {
    await setUserMoney(0)

    let idealMessage = "you can't afford a new game"
    let actualMessage = (await execute(dummyMessage, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to the database not having any keys", async function() {
    await setUserMoney(50000)

    let idealMessage = "sorry, I'm all out of keys!"
    let actualMessage = (await execute(dummyMessage, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to the database not having any unclaimed keys", async function() {
    const { hookAKeys } = require("../../db/db.js")
    await setUserMoney(50000)
    await hookAKeys.create( { key: "AAAAA-AAAAA-AAAAA", claimed: 12345 } )

    let idealMessage = "sorry, I'm all out of keys!"
    let actualMessage = (await execute(dummyMessage, []))[0].content
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly to a user claiming a key", async function() {
    const { hookAKeys } = require("../../db/db.js")
    await setUserMoney(50000)
    await hookAKeys.create( { key: "AAAAA-AAAAA-AAAAA" } )

    let idealFirstMessage = "Enjoy your new game!\nSteam key: AAAAA-AAAAA-AAAAA"
    let idealSecondMessage = "key has been sent via DM"
    let actualMessages = (await execute(dummyMessage, []))
    assert.equal(idealFirstMessage, actualMessages[0].content)
    assert.equal(idealSecondMessage, actualMessages[1].content)
  })
})
