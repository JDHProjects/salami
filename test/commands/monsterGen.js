const assert = require("assert")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const names = require("../../assets/monsters/names/names.json")

const { execute } = require("../../commands/monsterGen.js")

describe("The monsterGen command", function() {

  beforeEach(async function() {
    const { clearDb } = require("../helpers/clearDb.js")
    const { add5EMonsters } = require("../../db/functions/add5EMonsters.js")

    //sync db and clear tables before each test
    await clearDb()
    await add5EMonsters()
  })

  it("should respond correctly when a user requests a random monster", async function() {
    this.timeout(5000)
    let actualMessage = (await execute(dummyMessage, []))[1]
    
    assert.ok(names.includes(actualMessage.embed.title))
  })

  it("should respond correctly when a user requests an monster that doesn't exist", async function() {
    let idealMessage = "No monster found matching your criteria!"
    let actualMessage = (await execute(dummyMessage, ["invalid_monster"]))[0]

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a list of all monsters", async function() {
    let idealMessage = names.join("\n")
    let actualMessage = (await execute(dummyMessage, ["list"]))[0]

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a specific monster", async function() {
    this.timeout(5000)
    let idealTitle = "Aboleth"
    let actualMessage = (await execute(dummyMessage, ["Aboleth"]))[1]

    assert.equal(idealTitle, actualMessage.embed.title)
  })
})