const assert = require("assert")

describe("The database", function() {
  beforeEach(async function() {
    const { clearDb } = require("./helpers/clearDb.js")
    
    //sync db and clear tables before each test
    await clearDb()
  })

  it("should successfully set up", async function() {
    const { syncDB } = require("../db/functions/syncDB.js")
    let idealResp = /Bank refreshed\n[0-9]+ monsters added to database\n[0-9]+ spells added to database\n[0-9]+ items added to database\n[0-9]+ spaceman variants added to database\n[0-9]+ spaceman images regenerated from ID\nDatabase synced/g
    let actualResp = await syncDB()
    let matches = actualResp.match(idealResp)
    if (matches == null) {
      matches = []
    }

    assert.equal(1, matches.length)
  })

  it("should add monsters", async function() {
    const { add5EMonsters } = require("../db/functions/add5EMonsters.js")

    let resp = await add5EMonsters()
    assert.ok(resp.includes("monsters added to database"))
  })

  it("should add spells", async function() {
    const { add5ESpells } = require("../db/functions/add5ESpells.js")

    let resp = await add5ESpells()
    assert.ok(resp.includes("spells added to database"))
  })

  it("should add items", async function() {
    const { add5EItems } = require("../db/functions/add5EItems.js")

    let resp = await add5EItems()
    assert.ok(resp.includes("items added to database"))
  })

  it("should add spacemen variants", async function() {
    const { addSpacemanLayers } = require("../db/functions/addSpacemanLayers.js")

    let resp = await addSpacemanLayers()
    assert.ok(resp.includes("spaceman variants added to database"))
  })
})