module.exports = function(sequelize, DataTypes) {
    'use strict';
    return sequelize.define("tbl_greetings", {
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'tbl_greetings'
    });

};