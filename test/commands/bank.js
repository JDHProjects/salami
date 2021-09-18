const assert = require('assert');

const { execute } = require('../../commands/bank.js')

describe('The bank command', function() {
  
  before(async function() {
    const { refreshBank } = require('../../db/functions/refreshBank.js')
    const { clearDb } = require('../functions/clearDb.js')

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it('should respond ', async function() {
    let idealMessage = 'The bank currently holds:\n**1000000000 salami**\nWhich is 100% of the total market'
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
