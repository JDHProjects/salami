const { syncDB } = require('../db/db.js')
const assert = require('assert');

describe('The database', function() {
  it('should successfully create', function() {
    return syncDB()
    .then(resp => {
      console.log(resp)
      assert.equal('Database synced', resp);
    })
  })
})