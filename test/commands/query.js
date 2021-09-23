const assert = require("assert")

const { execute } = require("../../commands/query.js")

const { setUserMoney } = require("../helpers/setUserMoney.js")

describe("The query command", function() {
  
  beforeEach(async function() {
    const { clearDb } = require("../helpers/clearDb.js")
    const { refreshBank } = require("../../db/functions/refreshBank.js")

    //sync db before each test
    await clearDb()
    await setUserMoney(0)
    await refreshBank()
  })

  it("should respond correctly", async function() {
    let idealMessage = "Response:\n[[{\"user_id\":\"12345\",\"money\":0},{\"user_id\":\"637400095821660180\",\"money\":0},{\"user_id\":\"0\",\"money\":1000000000}],{\"sql\":\"SELECT * FROM bank_accounts\"}]\nResponse complete"
    let actualMessage = (await execute({}, ["SELECT", "*", "FROM", "bank_accounts"]))[1][0]
    assert.equal(idealMessage, actualMessage)
  })

  it("should back up the database", async function() {
    let idealMessage = "DB backup file"
    let actualMessage = (await execute({}, ["SELECT", "*", "FROM", "bank_accounts"]))
    assert.equal(idealMessage, actualMessage[0][0])

    let idealFile = "./database.sqlite"
    assert.equal(idealFile, actualMessage[0][1].files[0])
  })
})
