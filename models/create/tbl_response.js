module.exports = function(sequelize, DataTypes) {
    'use strict';
    return sequelize.define("tbl_response", {
        hasresponse: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'tbl_response'
    });

};