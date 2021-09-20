module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    claimed: {
      type: DataTypes.STRING,
      defaultValue: "none"
    },
  }

  return sequelize.define("hook_a_keys",
    buildModel
    , {
      timestamps: false,
    })
}