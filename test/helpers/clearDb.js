const map = require('lodash/map');

const clearDb = function() {
  return new Promise(async function(resolve, reject) {
    const { sequelize, models } = require('../../db/db.js')

    await sequelize.sync();
    await Promise.all(
      map(models, model => {
        return model.destroy({ where: {}, force: true });
      })
    );
    resolve("database wiped")
  })
}

module.exports = { clearDb }