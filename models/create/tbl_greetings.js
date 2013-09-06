module.exports = function(sequelize, DataTypes) {

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