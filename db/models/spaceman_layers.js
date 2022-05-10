module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    layer: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    layer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    }
  }

  return sequelize.define("spaceman_layers",
    buildModel
    , {
      timestamps: false,
    })
}