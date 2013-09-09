(function() {
    'use strict';
    module.exports = function(sequelize) {
        return sequelize.define("tbl_greetingstbl_users", {}, {
            tableName: 'tbl_greetingstbl_users'
        });
    };
}());