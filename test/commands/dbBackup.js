const assert = require("assert")

const { execute } = require("../../commands/dbBackup.js")

describe("The dbBackup command", function() {
  
  beforeEach(async function() {
    const { clearDb } = require("../helpers/clearDb.js")

    //sync db before each test
    await clearDb()
  })

  it("should respond correctly", function() {
    let idealMessage = "DB backup file"
    let actualMessage = execute({}, [])[0]
    assert.equal(idealMessage, actualMessage)
  })

  it("should send the database file", function() {
    let idealFile = "./database.sqlite"
    let actualFile = execute({}, [])[1].files[0]
    assert.equal(idealFile, actualFile)
  })
})
