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
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }

  return sequelize.define("spaceman_images",
    buildModel
    , {
      timestamps: false,
    })
}