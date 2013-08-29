module.exports = function(sequelize, DataTypes) {

	return sequelize.define("Response", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		empid: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: "tbl_users",
			referencesKey: "empid"
		},
		greetingid: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: "tbl_greetings",
			referencesKey: "id"
		},
		hasresponse: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'tbl_response'
	});

};

