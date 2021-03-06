module.exports = function(sequelize, DataTypes) {
    'use strict';
    return sequelize.define("tbl_users", {
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