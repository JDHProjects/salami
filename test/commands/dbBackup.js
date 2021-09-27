const assert = require("assert")

const { execute } = require("../../commands/dbBackup.js")

describe("The dbBackup command", function() {
  it("should respond correctly", async function() {
    let idealMessage = "DB backup file"
    let actualMessage = (await execute({}, [])).content
    assert.equal(idealMessage, actualMessage)
  })

  it("should send the database file", async function() {
    let idealFile = "./database.sqlite"
    let actualFile = (await execute({}, [])).files[0]
    assert.equal(idealFile, actualFile)
  })
})
