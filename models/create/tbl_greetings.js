module.exports = function(sequelize, DataTypes) {

	return sequelize.define("Greetings", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		empid: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			references: "tbl_users",
			referencesKey: "empid"
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		}
	}, {
		tableName: 'tbl_greetings'
	});

};


