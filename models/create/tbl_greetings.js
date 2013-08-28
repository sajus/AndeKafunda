module.exports = function(sequelize, DataTypes) {

	return sequelize.define("Greetings", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true
			// validate: {
			// 	isUrl: true,
			// }
		}
	}, {
		tableName: 'tbl_greetings',
		timestamps: true,
		engine: 'INNODB', // engine: 'MYISAM', // default: 'InnoDB'
		paranoid: true,
		commment: "This is the table for storing greeting details",
		charset: 'utf8'
	});

};


