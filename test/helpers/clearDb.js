const map = require("lodash/map")

const clearDb = async function() {
  const { sequelize, models } = require("../../db/db.js")

  await sequelize.sync()
  await Promise.all(
    map(models, model => {
      return model.destroy({ where: {}, force: true })
    })
  )
  return "database wiped"
}

module.exports = { clearDb }