const assert = require('assert');
const map = require('lodash/map');

describe('The database', function() {
  beforeEach(async function() {
    //sync db and clear tables before each test
    const { sequelize, models } = require('../db/db.js')

    await sequelize.sync();
    return await Promise.all(
      map(models, model => {
        return model.destroy({ where: {}, force: true });
      })
    );
  });

  it('should successfully set up', function() {
    const { syncDB } = require('../db/functions/syncDB.js')

    console.log('\n')
    return syncDB()
    .then(resp => {
      console.log(`${resp}\n`)
      assert.equal('Database synced', resp);
    })
  })

  it('should add monsters', function() {
    const { add5EMonsters } = require('../db/functions/add5EMonsters.js')

    console.log('\n')
    return add5EMonsters()
    .then(resp =>{
      console.log(resp)
      assert.equal(resp.includes('monsters added to database'), true);
    })
  })

  it('should add spells', function() {
    const { add5ESpells } = require('../db/functions/add5ESpells.js')

    console.log('\n')
    return add5ESpells()
    .then(resp =>{
      console.log(resp)
      assert.equal(resp.includes('spells added to database'), true);
    })
  })

  it('should add items', function() {
    const { add5EItems } = require('../db/functions/add5EItems.js')

    console.log('\n')
    return add5EItems()
    .then(resp =>{
      console.log(resp)
      assert.equal(resp.includes('items added to database'), true);
    })
  })
})