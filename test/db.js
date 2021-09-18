const { syncDB } = require('../db/db.js')
const assert = require('assert');

describe('The database', function() {
  it('should successfully create', function() {
    console.log('\n')
    return syncDB()
    .then(resp => {
      console.log(`${resp}\n`)
      assert.equal('Database synced', resp);
    })
  })
})