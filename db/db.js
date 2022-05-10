const Sequelize = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: `${process.env.TEST == "TRUE" ? "test-database.sqlite" : "database.sqlite"}`,
})

const stocks = require("./models/stocks")(sequelize, Sequelize.DataTypes)
const commandStats = require("./models/command_stats")(sequelize, Sequelize.DataTypes)
const bankAccounts = require("./models/bank_accounts")(sequelize, Sequelize.DataTypes)
const hookAKeys = require("./models/hook_a_keys")(sequelize, Sequelize.DataTypes)
const botValues = require("./models/bot_values")(sequelize, Sequelize.DataTypes)
const fiveEMonsters = require("./models/5e_monsters")(sequelize, Sequelize.DataTypes)
const fiveESpells = require("./models/5e_spells")(sequelize, Sequelize.DataTypes)
const fiveEItems = require("./models/5e_items")(sequelize, Sequelize.DataTypes)
const spacemanLayers = require("./models/spaceman_layers")(sequelize, Sequelize.DataTypes)
const spacemanImages = require("./models/spaceman_images")(sequelize, Sequelize.DataTypes)

const models = [ stocks, commandStats, bankAccounts, hookAKeys, botValues, fiveEMonsters, fiveESpells, fiveEItems, spacemanLayers, spacemanImages ]

module.exports = {sequelize, stocks, commandStats, bankAccounts, hookAKeys, botValues, fiveEMonsters, fiveEItems, fiveESpells, models, spacemanLayers, spacemanImages }