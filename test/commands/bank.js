const assert = require('assert');

const { execute } = require('../../commands/bank.js')

describe('The bank command', function() {
  
  beforeEach(async function() {
    const { refreshBank } = require('../../db/functions/refreshBank.js')
    const { clearDb } = require('../setup-functions/clearDb.js')

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  it('should respond correctly when all money owned by bank', async function() {
    let idealMessage = 'The bank currently holds:\n**1000000000 salami**\nWhich is 100% of the total market'
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })

  it('should respond correctly when half money owned by bank', async function() {
    const { setUserMoney } = require('../setup-functions/setUserMoney.js')
    await setUserMoney(500000000,0)
    await setUserMoney(500000000)
    let idealMessage = 'The bank currently holds:\n**500000000 salami**\nWhich is 50% of the total market'
    let actualMessage = (await execute({}, []))[0]
    assert.equal(actualMessage, idealMessage)
  })
})
