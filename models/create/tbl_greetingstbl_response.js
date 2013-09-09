(function() {
    'use strict';
    module.exports = function(sequelize) {
        return sequelize.define("tbl_greetingstbl_response", {}, {
            tableName: 'tbl_greetingstbl_response'
        });
    };
}());