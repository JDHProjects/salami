module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    variable: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		value: {
			type: DataTypes.STRING,
			defaultValue: "none"
		},
  }

	return sequelize.define('bot_values',
		buildModel
  );
};