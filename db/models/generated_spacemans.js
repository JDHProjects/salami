const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.BLOB("long"),
      allowNull: false,
    },
  }

  return sequelize.define("generated_spacemans",
    buildModel
    , {
      timestamps: false,
    })
}