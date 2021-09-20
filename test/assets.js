const assert = require('assert');
const fs = require('fs');

describe('The asset folder', function() {

  it('should contain at least 3 monkey-mimic images', function() {
    checkExists('./assets/monkey-mimics/1.jpeg')
    checkExists('./assets/monkey-mimics/2.jpeg');
    checkExists('./assets/monkey-mimics/3.jpeg');
  })

  it('should contain the wildsurge data', function() {
    checkExists('./assets/wildSurge/table.json');
  })

  it('should contain the monsters data', function() {
    checkExists('./assets/monsters/names/names.json');
    checkExists('./assets/monsters/data/data.json');
  })

  it('should contain the spells data', function() {
    checkExists('./assets/spells/names/names.json');
    checkExists('./assets/spells/data/data.json');
  })

  it('should contain the items data', function() {
    checkExists('./assets/items/names/names.json');
    checkExists('./assets/items/data/data.json');
  })
})

const checkExists = function(path){
  let fileExists = fs.existsSync(path)
  assert.ok(fileExists);
}