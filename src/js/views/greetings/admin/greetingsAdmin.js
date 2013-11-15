define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        _ = require('underscore'),
        FuelUxDataSource = require('fueluxDataSource'),
        greetingsAdminTemplate = require('template!templates/greetings/admin/greetingsAdmin'),
        globalSelected = [],
        checkCounter = 0,
        GreetingModal = require('views/greetings/admin/greetingModal'),
        ConfirmModal = require('views/greetings/admin/confirmModal'),
        GreetingModel = require('models/greetings/greeting'),
        UsersCollection = require('collections/user/userCollection'),
        Events = require('events');
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
            Events.on('confirmedGreetingDelete', this.confirmedDelete, this);
            Events.on('refreshView', this.refreshView, this);
        },
        render: function() {
            this.$el.html(greetingsAdminTemplate());
            this.createDataGrid(this.formatData(this.collection.toJSON()));
            Events.trigger('refreshActiveState');
        },
        refreshView: function() {
            var self = this;
            globalSelected = [];
            this.collection.fetch({
                success: function() {
                    self.render();
                }
            });
        },
        events: {
            'click button.greetingEdit': 'greetingEdit',
            'click .greetingCreate': 'greetingCreate',
            'click .greetingDelete': 'greetingDelete',
            // 'click .sendEmail': 'sendEmail',
            'change .selectUsersAtOnce': 'gridCheckBox',
            'loaded #MyGrid': 'cleanSelectAll',
            'change .selectrows': 'rowSelected'
        },
        formatData: function(data) {
            var greetings = [],
                greeting,
                selectRows = "",
                operationHTML = "";
            _.each(data, function(greetingModel) {
                var usersData = greetingModel.tblUsers[0];
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
                    label: "<input type='checkbox' class='selectUsersAtOnce'>",
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
            var target = this.$(e.target).closest('button'),
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
                        self.$('.modal-container .modal').modal();
                    }
                });
            });
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
                    self.$('.modal-container .modal').modal();
                }
            });
        },
        greetingDelete: function() {
            var confirmDelete = new ConfirmModal();
            this.$('.modal-containerConfirm').html(confirmDelete.render().el);
            this.$('.modal-containerConfirm .modal').modal('show');
        },
        confirmedDelete: function() {
            var confirmModal$ = this.$('.modal-containerConfirm .modal'),
                greetingModel = new GreetingModel();
            greetingModel.set('id', globalSelected);
            greetingModel.destroy({
                success: function(model, responseText) {
                    console.log(responseText);
                    Events.trigger("alert:success", [{
                        message: "Greeting deleted successfully."
                    }]);
                    setTimeout(function() {
                        confirmModal$.modal('hide');
                    }, 1500);
                    confirmModal$.on('hidden', function() {
                        Events.trigger('refreshView');
                    });
                }
            });
        },
        // sendEmail: function() {
        //     console.log("Send Email");
        // },
        cleanSelectAll: function() {
            this.$('.selectUsersAtOnce').prop('checked', false);
        },
        gridCheckBox: function(e) {
            e.preventDefault();
            e.stopPropagation();
            globalSelected = [];
            var greetingDelete$ = this.$('.greetingDelete'),
                selectrows$ = this.$('.selectrows'),
                tableRow$ = this.$('table[id="MyGrid"] tbody tr');
            this.$('.selectUsersAtOnce').prop('checked', function() {
                if (this.checked) {
                    $(this).prop("checked", true);
                    selectrows$.prop("checked", true);
                    tableRow$.addClass('warning');
                    tableRow$.each(function() {
                        globalSelected.push(parseInt($(this).find('td').eq(1).text(), 10));
                    });
                    greetingDelete$.removeProp('disabled').removeClass('disabled');
                } else {
                    $(this).prop('checked', false);
                    selectrows$.prop('checked', false);
                    tableRow$.removeClass('warning');
                    greetingDelete$.prop('disabled', true).addClass('disabled');
                }
            });
        },

        rowSelected: function(e) {
            e.stopPropagation();
            var target$ = this.$(e.target),
                greetingDelete$ = this.$('.greetingDelete');
            target$.prop('checked', function() {
                if (this.checked) {
                    target$.closest('tr').addClass('warning selectedRow');
                    globalSelected.push(parseInt(target$.attr('data-id'), 10));
                    checkCounter++;
                    if (checkCounter > 0) {
                        $('.greetingDelete').removeProp('disabled').removeClass('disabled');
                    }
                } else {
                    checkCounter--;
                    $('.selectrows').prop('checked', function() {
                        if (target$.closest('tr').hasClass('error')) {
                            target$.closest('tr').removeClass('error selectedRow');
                        } else {
                            target$.closest('tr').removeClass('warning selectedRow');
                        }
                    });
                    globalSelected.pop(target$.attr('data-id'));
                    if (checkCounter === 0) {
                        greetingDelete$.prop('disabled', true).addClass('disabled');
                    }
                }
            });
        },

        onClose: function() {
            Events.off(null, null, this);
        }
    });
});