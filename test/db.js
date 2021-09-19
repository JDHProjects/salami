const assert = require('assert');

describe('The database', function() {
  beforeEach(async function() {
    const { clearDb } = require('./setup-functions/clearDb.js')
    
    //sync db and clear tables before each test
    await clearDb()
  });

  it('should successfully set up', async function() {
    const { syncDB } = require('../db/functions/syncDB.js')

    console.log('\n')
    let resp = await syncDB()
    console.log(`${resp}\n`)
    assert.equal('Database synced', resp);
  })

  it('should add monsters', async function() {
    const { add5EMonsters } = require('../db/functions/add5EMonsters.js')

    console.log('\n')
    let resp = await add5EMonsters()
    console.log(resp)
    assert.ok(resp.includes('monsters added to database'));
  })

  it('should add spells', async function() {
    const { add5ESpells } = require('../db/functions/add5ESpells.js')

    console.log('\n')
    let resp = await add5ESpells()
    console.log(resp)
    assert.ok(resp.includes('spells added to database'));
  })

  it('should add items', async function() {
    const { add5EItems } = require('../db/functions/add5EItems.js')

    console.log('\n')
    let resp = await add5EItems()
    console.log(resp)
    assert.ok(resp.includes('items added to database'));
  })
})