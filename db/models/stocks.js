module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    average_cost: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
  }

  return sequelize.define("stocks",
    buildModel
    , {
      timestamps: false,
    })
}