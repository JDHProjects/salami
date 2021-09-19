const assert = require('assert');

const { execute } = require('../../commands/circulation.js')

describe('The circulation command', function() {
  
  before(async function() {
    const { refreshBank } = require('../../db/functions/refreshBank.js')
    const { clearDb } = require('../setup-functions/clearDb.js')

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it('should respond correctly', async function() {
    let idealMessage = /The current amount of salami in user circulation on [0-9A-Za-z,: ]+ is:\n\*\*0 salami\*\*\n<@637400095821660180> owns 0% of the salami in circulation/g
    //The bank currently holds:\n**1000000000 salami**\nWhich is 100% of the total market/
    let actualMessage = (await execute({}, []))[0]
    
    assert.equal(1, (actualMessage.match(idealMessage)).length)
  })
})
