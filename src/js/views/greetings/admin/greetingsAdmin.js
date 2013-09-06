define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        _ = require('underscore'),
        FuelUxDataSource = require('fueluxDataSource'),
        greetingsAdminTemplate = require('template!templates/greetings/admin/greetingsAdmin'),
        globalSelected = [],
        checkCounter = 0,
        GreetingModal = require('views/greetings/admin/greetingModal'),
        GreetingModel = require('models/greetings/greeting'),
        UsersCollection = require('collections/user/userCollection');
    /* Requires with no return */
    require('fueluxDataGrid');
    require('bootstrapDropdown');
    require('fueluxComboBox');
    require('fueluxSelectBox');
    require('fueluxSearchBox');
    return Backbone.View.extend({

        el: '.page',
        initialize: function() {
            var self = this;
            this.collection.fetch({
                success: function() {
                    self.render();
                }
            });
        },
        render: function() {
            this.$el.html(greetingsAdminTemplate());
            this.createDataGrid(this.formatData(this.collection.toJSON()));
        },

        events: {
            'click button.greetingEdit': 'greetingEdit',
            'click .greetingCreate': 'greetingCreate',
            // 'click .greetingDelete': 'greetingDelete',
            // 'mouseover .greetingDelete': 'rowSelectedDelete',
            // 'mouseout .greetingDelete': 'rowSelectedNotDelete',
            // 'click .greetingDelete': 'greetingDelete',
            // 'click .summary': 'userTblSummary',
            // 'click .sendEmail': 'sendEmail',
            // 'change #selectUsersAtOnce': 'gridCheckBox',
            // //'loaded #MyGrid': 'gridCheckBox',
            // 'click .selectrows': 'rowSelected'
        },
        formatData: function(data) {
            var greetings = [],
                greeting,
                selectRows = "",
                operationHTML = "";
            _.each(data, function(greetingModel) {
                var usersData = greetingModel.tblUsers.pop();
                operationHTML = "<button class='btn btn-small btn-primary greetingEdit' type='button' data-id='" + greetingModel.id + "'><i class='icon-edit icon-white'></i> Edit</button>";
                selectRows = "<input type='checkbox' class='selectrows' data-id=" + greetingModel.id + ">";
                greeting = {};
                greeting = _.object([
                    "selectrows",
                    "id",
                    "firstname",
                    "lastname",
                    "email",
                    "url",
                    "operations"
                ], [
                    selectRows,
                    greetingModel.id,
                    usersData.firstname,
                    usersData.lastname,
                    usersData.email,
                    greetingModel.url,
                    operationHTML
                ]);

                greetings.push(greeting);
            });
            return greetings;
        },
        capitaliseFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        createDataGrid: function(data) {
            var DataSource = new FuelUxDataSource({
                columns: [{
                    property: "selectrows",
                    label: "<input type='checkbox' id='selectUsersAtOnce'>",
                    sortable: false
                }, {
                    property: "id",
                    label: "Greeting Id",
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
                }, {
                    property: "url",
                    label: "Url",
                    sortable: true
                }, {
                    property: "operations",
                    label: "Operations",
                    sortable: false
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
                stretchHeight: false
            });
        },
        greetingEdit: function(e) {
            var target = this.$(e.target),
                greetingModel = new GreetingModel({
                    id: target.attr('data-id')
                }),
                greetingModal = new GreetingModal({
                    editMode: true,
                    model: greetingModel
                }),
                usersCollection = new UsersCollection(),
                self = this;
            console.log(target.attr('data-id'));
            greetingModal.fetchData().done(function() {
                usersCollection.fetch({
                    success: function() {
                        self.$('.modal-container').html(greetingModal.render(usersCollection.toJSON()).el);
                        self.$('.modal').modal();
                    }
                });
            });
            // var self = this;
            // var userEdit = new UserEditView();
            // this.$('.modal-container').html(userEdit.render().el);
            // this.$('#editModal').modal({
            //     backdrop: 'static'
            // });
            // this.getUserModel.set({
            //     id: 9901
            // });
            // this.getUserModel.save(self.getUserModel.toJSON(), {
            //     success: function() {
            //         console.log('success');
            //     },
            //     error: function() {
            //         console.log('error');
            //     }
            // });

        },
        greetingCreate: function(e) {
            e.preventDefault();
            var greetingModel = new GreetingModel(),
                greetingModal = new GreetingModal({
                    editMode: false,
                    model: greetingModel
                }),
                usersCollection = new UsersCollection(),
                self = this;
            usersCollection.fetch({
                success: function() {
                    self.$('.modal-container').html(greetingModal.render(usersCollection.toJSON()).el);
                    self.$('.modal').modal();
                }
            });

        }
        // userDelete: function() {
        //     var userDelete = new UserDeleteView();
        //     this.$('.modal-container').html(userDelete.render().el);
        //     this.$('#deleteModal').modal({
        //         backdrop: 'static'
        //     });
        // },

        // userTblSummary: function() {
        //     var usersSummary = new UsersSummaryView();
        //     this.$('.modal-container').html(usersSummary.render().el);
        //     this.$('#summaryModal').modal();
        //     this.summaryData(this.collection.toJSON());
        //     $('body').append($('#summaryModal').find('.summaryModal').html());
        //     $('.container').siblings('.table-bordered').addClass('addPrint');
        // },

        // sendEmail: function() {
        //     console.log("Send Email");
        // },

        // gridCheckBox: function(e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     $('#selectUsersAtOnce').prop('checked', function() {
        //         if (this.checked) {
        //             $('.userDelete').removeProp('disabled').removeClass('disabled');
        //             $(this).prop("checked", true);
        //             $('.selectrows').prop("checked", true);
        //             $('table[id="MyGrid"] tbody tr').addClass('warning')
        //         } else {
        //             $(this).prop('checked', false);
        //             $('.selectrows').prop('checked', false);
        //             $('table[id="MyGrid"] tbody tr').removeClass('warning');
        //             $('.userDelete').prop('disabled', 'true');
        //         }
        //     });
        // },

        // rowSelected: function(e) {
        //     //console.log($(e.target).closest('input[type="checkbox"]').attr('data-id'));
        //     $($(e.target).closest('input[type="checkbox"]')).prop('checked', function() {
        //         if (this.checked) {
        //             $(e.target).closest('tr').addClass('warning selectedRow');
        //             globalSelected.push($(e.target).closest('input[type="checkbox"]').attr('data-id'));
        //             checkCounter++;
        //             if (checkCounter > 0) {
        //                 $('.userDelete').removeProp('disabled').removeClass('disabled');
        //             }

        //         } else {
        //             checkCounter--;
        //             if (checkCounter == 0) {
        //                 $('.userDelete').prop('disabled', 'true');
        //             }
        //             $('.selectrows').prop('checked', function() {
        //                 if ($(e.target).closest('tr').hasClass('error')) {
        //                     $(e.target).closest('tr').removeClass('error selectedRow');
        //                 } else {
        //                     $(e.target).closest('tr').removeClass('warning selectedRow');
        //                 }
        //             });
        //             globalSelected.pop($(e.target).closest('input[type="checkbox"]').attr('data-id'));
        //         }
        //     });
        //     //console.log("Users Selected::-")
        //     //console.log(globalSelected);
        // },

        // rowSelectedDelete: function() {
        //     $('.selectrows').prop('checked', function() {
        //         if (this.checked) {
        //             $(this).parent().parent().removeClass('warning').addClass('error');
        //             //$('.selectedRow').removeClass('warning').addClass('error');
        //         }
        //     });
        // },

        // rowSelectedNotDelete: function() {
        //     $('.selectrows').prop('checked', function() {
        //         if (this.checked) {
        //             $(this).parent().parent().removeClass('error').addClass('warning');
        //             //$('.selectedRow').removeClass('erro').addClass('warning');
        //         }
        //     });
        // }

    });
});