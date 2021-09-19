const assert = require('assert');
const fs = require('fs');

const { parseAndRollDice } = require('../../functions/parseAndRollDice')

describe('The parseAndRollDice function', function() {

  it('should return 0 with no input', function() {
    console.log('\n')
    assert.equal(parseAndRollDice("")[1], 0)
  })

  it('should return 0 with invalid input', function() {
    console.log('\n')
    assert.equal(parseAndRollDice("invalid")[1], 0)
  })

  it('should return valid total', function() {
    console.log('\n')
    let output = parseAndRollDice("1d4 +6 5d2-3")[1]
    assert.ok(output >= 9 && output <= 17)
  })

  it('should return integer', function() {
    console.log('\n')
    let output = parseAndRollDice("1d4")[1]
    assert.ok(!isNaN(output))
  })

  it('should return valid total ignoring invalid input', function() {
    console.log('\n')
    let output = parseAndRollDice("2d5 1d4 +6 5d2-3 -7 +13 d1")[1]
    assert.ok(output >= 18 && output <= 34)
  })

  it('should return valid negative number', function() {
    console.log('\n')
    let output = parseAndRollDice("2d2-7")[1]
    assert.ok(output >= -5 && output <= -3)
  })
})
