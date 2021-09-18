const assert = require('assert');

describe('The database', function() {
  beforeEach(async function() {
    const { clearDb } = require('./functions/clearDb.js')
    
    //sync db and clear tables before each test
    await clearDb()
  });

  it('should successfully set up', function() {
    const { syncDB } = require('../db/functions/syncDB.js')

    console.log('\n')
    return syncDB()
    .then(resp => {
      console.log(`${resp}\n`)
      assert.equal('Database synced', resp);
    })
  })

  it('should add monsters', function() {
    const { add5EMonsters } = require('../db/functions/add5EMonsters.js')

    console.log('\n')
    return add5EMonsters()
    .then(resp =>{
      console.log(resp)
      assert.ok(resp.includes('monsters added to database'));
    })
  })

  it('should add spells', function() {
    const { add5ESpells } = require('../db/functions/add5ESpells.js')

    console.log('\n')
    return add5ESpells()
    .then(resp =>{
      console.log(resp)
      assert.ok(resp.includes('spells added to database'));
    })
  })

  it('should add items', function() {
    const { add5EItems } = require('../db/functions/add5EItems.js')

    console.log('\n')
    return add5EItems()
    .then(resp =>{
      console.log(resp)
      assert.ok(resp.includes('items added to database'));
    })
  })
})