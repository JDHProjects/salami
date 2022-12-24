const assert = require("assert")

const { dummyMessage } = require("../helpers/dummyMessages.js")
const names = require("../../assets/items/names/names.json")

const { execute } = require("../../commands/itemGen.js")

describe("The itemGen command", function() {

  beforeEach(async function() {
    const { clearDb } = require("../helpers/clearDb.js")
    const { add5EItems } = require("../../db/functions/add5EItems.js")

    //sync db and clear tables before each test
    await clearDb()
    await add5EItems()
  })

  it("should respond correctly when a user requests a random item", async function() {
    let actualMessage = (await execute(dummyMessage, []))
    assert.ok(names.includes(actualMessage.embeds[0].data.title))
  })

  it("should respond correctly when a user requests an item that doesn't exist", async function() {
    let idealMessage = "No item found matching your criteria!"
    let actualMessage = (await execute(dummyMessage, ["invalid_item"])).content

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a list of all items", async function() {
    let idealMessage = names.join("\n")
    let actualMessage = (await execute(dummyMessage, ["list"])).content

    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly when a user requests a specific item", async function() {
    let idealTitle = "Abacus"
    let actualMessage = (await execute(dummyMessage, ["Abacus"]))

    assert.equal(idealTitle, actualMessage.embeds[0].data.title)
  })
})
