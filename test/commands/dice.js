const assert = require("assert")

const { execute } = require("../../commands/dice.js")

describe("The dice command", function() {

  it("should respond correctly with no input", function() {
    let idealMessage = "**Overall Total: 0**\n\nOverall Modifier: 0\n**Modifier Adjusted Total: 0**\n\n"
    let actualMessage = execute({}, [])[0]
    
    assert.equal(idealMessage, actualMessage)
  })

  it("should respond correctly with an input", function() {
    let idealMessage = /1 D20: [0-9]+\n\*\*1D20 Total: [0-9]+\*\*\n\n\*\*Overall Total: [0-9]+\*\*\n\nOverall Modifier: \+6\n\*\*Modifier Adjusted Total: [0-9]+\*\*\n\n/g
    let actualMessage = execute({}, ["1d20 +6"])[0]
    let matches = actualMessage.match(idealMessage)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(1, matches.length)
  })
})
