(function() {
    'use strict';
    module.exports = function(sequelize) {
        return sequelize.define("tbl_responsetbl_users", {}, {
            tableName: 'tbl_responsetbl_users'
        });
    };
}());