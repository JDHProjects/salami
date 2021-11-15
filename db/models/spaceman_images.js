module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
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

  return sequelize.define("spaceman_images",
    buildModel
    , {
      timestamps: false,
    })
}