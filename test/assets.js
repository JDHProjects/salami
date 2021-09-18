const assert = require('assert');
const fs = require('fs');

describe('The asset folder', function() {

  it('should contain at least 3 monkey-mimic images', function() {
    console.log('\n')
    checkExistsAndOutput('./assets/monkey-mimics/1.jpeg')
    checkExistsAndOutput('./assets/monkey-mimics/2.jpeg');
    checkExistsAndOutput('./assets/monkey-mimics/3.jpeg');
  })

  it('should contain the wildsurge data', function() {
    console.log('\n')
    checkExistsAndOutput('./assets/wildSurge/table.json');
  })

  it('should contain the monsters data', function() {
    console.log('\n')
    checkExistsAndOutput('./assets/monsters/names/names.json');
    checkExistsAndOutput('./assets/monsters/data/data.json');
  })

  it('should contain the spells data', function() {
    console.log('\n')
    checkExistsAndOutput('./assets/spells/names/names.json');
    checkExistsAndOutput('./assets/spells/data/data.json');
  })

  it('should contain the items data', function() {
    console.log('\n')
    checkExistsAndOutput('./assets/items/names/names.json');
    checkExistsAndOutput('./assets/items/data/data.json');
  })
})

const checkExistsAndOutput = function(path){
  let fileExists = fs.existsSync(path)
  if (fileExists){
    console.log(`File exists: ${path}`)
  }
  else {
    console.log(`File does not exist: ${path}`)
  }
  assert.ok(fileExists);
}