module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
    },
    school: {
      type: DataTypes.STRING,
    },
    casting_time: {
      type: DataTypes.STRING,
    },
    range: {
      type: DataTypes.STRING,
    },
    components: {
      type: DataTypes.INTEGER,
    },
    materials: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    classes: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    higher_level: {
      type: DataTypes.STRING,
    },
  }

  return sequelize.define("5e_spells",
    buildModel
    , {
      timestamps: false,
    })
}