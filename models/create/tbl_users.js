module.exports = function(sequelize, DataTypes) {

	return sequelize.define("Users", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		empid: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		email: {
			type: DataTypes.STRING(50),
			allowNull: false,
			validate: {
				isEmail: true,
				len: [7, 50]
			}
		},
		firstname: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				isAlpha: true,
				len: [2, 20]
			}
		},
		lastname: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				isAlpha: true,
				len: [2, 20]
			}
		},
		password: {
			type: DataTypes.STRING(40),
			allowNull: false,
			validate: {
				len: [8, 40]
				// isCustomValidation: function(value) {
			 //        // You custom validation code block
			 //    }
			}
		},
		accesstype: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'tbl_users'
	});

};