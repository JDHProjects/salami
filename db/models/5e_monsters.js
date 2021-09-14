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
		description: {
			type: DataTypes.STRING,
		},
		type: {
			type: DataTypes.STRING,
		},
		size : {
			type: DataTypes.STRING,
		},
		alignment: {
			type: DataTypes.STRING,
		},
		ac: {
			type: DataTypes.INTEGER,
		},
		ac_info: {
			type: DataTypes.STRING,
		},
		average_hp: {
			type: DataTypes.INTEGER,
		},
		hp_dice: {
			type: DataTypes.STRING,
		},
		speed: {
			type: DataTypes.STRING,
		},
		str: {
			type: DataTypes.INTEGER,
		},
		str_mod: {
			type: DataTypes.STRING,
		},
		dex: {
			type: DataTypes.INTEGER,
		},
		dex_mod: {
			type: DataTypes.STRING,
		},
		con: {
			type: DataTypes.INTEGER,
		},
		con_mod: {
			type: DataTypes.STRING,
		},
		int: {
			type: DataTypes.INTEGER,
		},
		int_mod: {
			type: DataTypes.STRING,
		},
		wis: {
			type: DataTypes.INTEGER,
		},
		wis_mod: {
			type: DataTypes.STRING,
		},
		cha: {
			type: DataTypes.INTEGER,
		},
		cha_mod: {
			type: DataTypes.STRING,
		},
		saving_throws: {
			type: DataTypes.STRING,
		},
		skills: {
			type: DataTypes.STRING,
		},
		damage_immunities: {
			type: DataTypes.STRING,
		},
		damage_resistances: {
			type: DataTypes.STRING,
		},
		damage_vulnerabilities: {
			type: DataTypes.STRING,
		},
		condition_immunities: {
			type: DataTypes.STRING,
		},
		senses: {
			type: DataTypes.STRING,
		},
		languages: {
			type: DataTypes.STRING,
		},
		challenge_rating: {
			type: DataTypes.DOUBLE,
		},
		challenge_xp: {
			type: DataTypes.STRING,
		},
		traits: {
			type: DataTypes.STRING,
		},
		reactions: {
			type: DataTypes.STRING,
		},
		actions: {
			type: DataTypes.STRING,
		},
		legendary_actions: {
			type: DataTypes.STRING,
		},
  }

	return sequelize.define('5e_monsters',
		buildModel
	, {
		timestamps: false,
	});
};