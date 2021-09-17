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
		type: {
			type: DataTypes.STRING,
		},
		subtype: {
			type: DataTypes.STRING,
		},
		rarity: {
			type: DataTypes.STRING,
		},
		modifiers: {
			type: DataTypes.STRING,
		},
		weight: {
			type: DataTypes.DOUBLE,
		},
		damage: {
			type: DataTypes.STRING,
		},
		damage_type: {
			type: DataTypes.STRING,
		},
		properties: {
			type: DataTypes.STRING,
		},
		range: {
			type: DataTypes.STRING,
		},
		duration: {
			type: DataTypes.STRING,
		},
		ac: {
			type: DataTypes.INTEGER,
		},
		stealth: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
  }

	return sequelize.define('5e_items',
		buildModel
	, {
		timestamps: false,
	});
};