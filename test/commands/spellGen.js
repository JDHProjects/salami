const assert = require("assert")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const names = require("../../assets/spells/names/names.json")

const { execute } = require("../../commands/spellGen.js")

describe("The spellGen command", function() {

  beforeEach(async function() {
    const { clearDb } = require("../helpers/clearDb.js")
    const { add5ESpells } = require("../../db/functions/add5ESpells.js")

    //sync db and clear tables before each test
    await clearDb()
    await add5ESpells()
  })

  it("should respond correctly when a user requests a random spell", async function() {
    let actualMessage = (await execute(dummyMessage, []))[1]
    
    assert.ok(names.includes(actualMessage.embed.title))
  })

  it("should respond correctly when a user requests an spell that doesn't exist", async function() {
    let idealMessage = "No spell found matching your criteria!"
    let actualMessage = (await execute(dummyMessage, ["invalid_spell"]))[0]

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a list of all spells", async function() {
    let idealMessage = names.join("\n")
    let actualMessage = (await execute(dummyMessage, ["list"]))[0]

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a specific spell", async function() {
    let idealTitle = "Acid Arrow"
    let actualMessage = (await execute(dummyMessage, ["Acid Arrow"]))[1]

    assert.equal(idealTitle, actualMessage.embed.title)
  })
})
