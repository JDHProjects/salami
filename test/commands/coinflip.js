const assert = require('assert');

const { setUserMoney } = require('../helpers/setUserMoney.js')

const { execute } = require('../../commands/coinflip.js')

const { dummyMessage } = require('../helpers/dummyMessage.js')

describe('The coinflip command', function() {
  
  beforeEach(async function() {
    const { refreshBank } = require('../../db/functions/refreshBank.js')
    const { clearDb } = require('../helpers/clearDb.js')

    //sync db and clear tables before each test
    await clearDb()
    await refreshBank()
  })

  
  it('should respond correctly with no guess', async function() {
    let idealMessage = "You forgot to pick heads or tails!"
    let actualMessage = (await execute({}, []))[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it('should respond correctly with a heads guess', async function() {
    await setUserMoney(0,12345)

    let idealMessage = /tails! <@12345>, you lose|heads! <@12345>, you win!/g
    let actualMessage = (await execute(dummyMessage, ["heads"]))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = -1
    }
    
    assert.equal(1, matches.length)
  })

  it('should respond correctly with a tails guess', async function() {
    await setUserMoney(0,12345)

    let idealMessage = /heads! <@12345>, you lose|tails! <@12345>, you win!/g
    let actualMessage = (await execute(dummyMessage, ["tails"]))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = -1
    }

    assert.equal(1, matches.length)
  })

  it('should respond correctly when user has insufficient money', async function() {
    await setUserMoney(0,12345)

    let idealMessage = /<@12345>, you don't have enough salami to make that bet/g
    let actualMessage = (await execute(dummyMessage, ["tails", "100"]))[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = -1
    }

    assert.equal(1, matches.length)
  })
})
