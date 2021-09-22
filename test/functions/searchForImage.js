const assert = require("assert")

const { parseAndRollDice, searchForImage } = require("../../functions/searchForImage")

describe("The searchForImage function", function() {

  it("should return a url", async function() {
    this.timeout(5000);
    let idealUrl = "https://"
    let actualUrl = await searchForImage("test", 0)
    
    assert.equal(actualUrl.slice(0,8), idealUrl)
  })

  it("should return two different urls for different index images", async function() {
    this.timeout(5000);
    let urlOne = await searchForImage("test", 0)
    let urlTwo = await searchForImage("test", 1)
    
    assert.notEqual(urlOne, urlTwo)
  })
})
