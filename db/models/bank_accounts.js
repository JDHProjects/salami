module.exports = (sequelize, DataTypes) => {
  let buildModel = {
    user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		money: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		}
  }

	return sequelize.define('bank_accounts',
		buildModel
	, {
		timestamps: false,
	});
};