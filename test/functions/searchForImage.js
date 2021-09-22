const assert = require("assert")

const { searchForImage } = require("../../functions/searchForImage")

describe("The searchForImage function", function() {

  it("should return a url", async function() {
    this.timeout(5000)
    let idealUrl = /http[s]?:\/\//g
    let actualUrl = await searchForImage("test", 0)
    let matches = actualUrl.match(idealUrl)
    if (matches == null) {
      matches = []
    }
    
    assert.equal(matches.length, 1)
  })

  it("should return two different urls for different index images", async function() {
    this.timeout(5000)
    let urlOne = await searchForImage("test", 0)
    let urlTwo = await searchForImage("test", 1)
    
    assert.notEqual(urlOne, urlTwo)
  })
})
