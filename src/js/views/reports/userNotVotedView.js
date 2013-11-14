define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        usersNotVotedTemplate = require('template!templates/reports/usersNotVoted'),
        FuelUxDataSource = require('fueluxDataSource'),
        services = require('services');

    /* Requires with no return */
    require('fueluxDataGrid');
    require('bootstrapDropdown');
    require('fueluxComboBox');
    require('fueluxSelectBox');
    require('fueluxSearchBox');

    return Backbone.View.extend({

        className: "modal fade",

        initialize: function() {
            console.log("initialize");
        },

        events: {
            'click .printUserNotVoted': 'printUserNotVoted'
        },

        printUserNotVoted: function() {
            var DocumentContainer = this.$('.fuelux'),
                WindowObject = window.open('', 'PrintWindow', 'width=1000,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
            WindowObject.document.writeln(DocumentContainer.html());
            console.log(DocumentContainer.html());
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();
        },

        fetchData: function() {
            return services.getUsersNotVoted();
        },

        render: function(data) {
            console.log("render");
            this.$el.html(usersNotVotedTemplate());
            console.log(this.$el.html(usersNotVotedTemplate()).html());
            this.createDataGrid(data);
            return this;
        },

        /*Table Formation*/
        createDataGrid: function(data) {
            var DataSource = new FuelUxDataSource({
                columns: [{
                    property: "id",
                    label: "Employee Id",
                    sortable: true
                }, {
                    property: "firstname",
                    label: "First Name",
                    sortable: true
                }, {
                    property: "lastname",
                    label: "Last Name",
                    sortable: true
                }, {
                    property: "email",
                    label: "Email",
                    sortable: true
                }],
                data: data,
                delay: 250
            });

            this.$('#MyGrid').datagrid({
                dataSource: DataSource,
                dataOptions: {
                    pageIndex: 0,
                    pageSize: 5
                },
                stretchHeight: true
            });
        },
    });
});