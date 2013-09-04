define(function(require) {

    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Events = require('events'),
        userTemplate = require('template!templates/user/userList'),
        FuelUxDataSource = require('fueluxDataSource'),
        EditModel = require('models/user/userCreateEditModel'),
        UserCreateView = require('views/user/userCreateView'),
        UserEditView = require('views/user/userCreateEditView'),
        DeleteModal = require('models/user/userDelete'),
        userDeleteTemplate = require('template!templates/user/userDelete'),
        globalSelected = [],
        checkCounter = 0;

    /* Requires with no return */
    require('jqueryCookie');
    require('fueluxDataGrid');
    require('bootstrapDropdown');
    require('fueluxComboBox');
    require('fueluxSelectBox');
    require('fueluxSearchBox');

    return Backbone.View.extend({

        initialize: function() {
            Events.on("refreshView", this.render, this);
            this.editUserModel = new EditModel();
        },

        el: '.page',

        events: {
            /*Row handler*/
            'mouseover .userDelete': 'rowSelectedDelete',
            'mouseout .userDelete': 'rowSelectedNotDelete',
            'change #selectUsersAtOnce': 'gridCheckBox',
            'click .selectrows': 'rowSelected',
            /*Edit handler*/
            'click .userEdit': 'userEdit',
            /*Delete handler*/
            'click .userDelete': 'userDelete',
            'click .confirmDelete': 'confirmDelete',
            /*Create handler*/
            'click .create': 'create'
        },

        render: function() {
            console.log('render');
            this.$el.html(userTemplate({
                isAdmin: true
            }));
            var self = this;
            this.collection.fetch({
                success: function() {
                    console.log("this");
                    self.createDataGrid(self.usersData(self.collection.toJSON()));
                    console.log("In success");
                }
            });
            return this;
        },

        /*Table Layout*/
        usersData: function(Userlist) {
            console.log("usersData");
            var userlistObj = {},
                userslistObj = [],
                operationHTML = '<button class="btn btn-small btn-primary userEdit" type="button"><i class="icon-edit icon-white"></i> Edit</button>';

            _.each(Userlist, function(userlist) {
                userlist.selectRows = "<input type='checkbox' class='selectrows' data-id=" + userlist.empid + ">";
                if (userlist.accesstype) {
                    userlist.access = "Admin";
                } else {
                    userlist.access = "User";
                }
                userlistObj = _.object([
                    "selectrows",
                    "empid",
                    "firstname",
                    "lastname",
                    "email",
                    "accesstype",
                    "operations"
                ], [
                    userlist.selectRows,
                    userlist.empid,
                    userlist.firstname,
                    userlist.lastname,
                    userlist.email,
                    userlist.access,
                    operationHTML
                ]);

                userslistObj.push(userlistObj);
            });

            return userslistObj;
        },

        /*Table Formation*/
        createDataGrid: function(userslistObj) {
            console.log("createDataGrid");
            var DataSource = new FuelUxDataSource({
                columns: [{
                    property: "selectrows",
                    label: "<input type='checkbox' id='selectUsersAtOnce'>",
                    sortable: false
                }, {
                    property: "empid",
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
                }, {
                    property: "accesstype",
                    label: "Access Level",
                    sortable: true
                }, {
                    property: "operations",
                    label: "Operations",
                    sortable: false
                }],
                data: userslistObj,
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

        /*Edit call*/
        userEdit: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var target$ = this.$(e.target),
                targetRow$ = target$.closest('tr'),
                id = targetRow$.find('td').eq(1).text(),
                userEdit;

            console.log(id);
            this.editUserModel.set('id', id);
            userEdit = new UserEditView({
                model: this.editUserModel
            });

            this.$('.modal-container').html(userEdit.render().el);
            this.$('#editModal').modal({
                backdrop: 'static'
            });
        },

        /*Delete call*/
        userDelete: function() {
            this.$('.modal-container').html(userDeleteTemplate);
            this.$('.modal').modal({
                backdrop: 'static'
            });
        },

        /*Delete confimation*/
        confirmDelete: function(e) {
            e.preventDefault();
            var self = this,
                deleteIndex = [];
            this.deleteUser = new DeleteModal();
            $('.warning').each(function() {
                deleteIndex.push($(this).find('td').eq(1).text());
            });
            this.deleteUser.set({
                id: deleteIndex
            });
            this.deleteUser.destroy().success(function() {
                console.log('User deleted successfully.');
                self.$('.modal').modal('hide');
                self.render();
                Events.trigger("alert:success", [{
                    message: "User deleted successfully."
                }]);
            }).error(function() {
                Events.trigger("alert:error", [{
                    message: "Some service error occured during data fetching."
                }]);
            });
            console.log(deleteIndex);
        },

        /*Create call*/
        create: function(e) {
            e.preventDefault();
            this.editUserModel.clear();
            console.log("create");
            var userCreate = new UserCreateView({
                model: this.editUserModel
            });
            this.$('.modal-container').html(userCreate.render().el);
            this.$('#createModal').modal({
                backdrop: 'static'
            });
        },

        /*Checkbox handling*/
        gridCheckBox: function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#selectUsersAtOnce').prop('checked', function() {
                if (this.checked) {
                    $('.userDelete').removeProp('disabled').removeClass('disabled');
                    $(this).prop("checked", true);
                    $('.selectrows').prop("checked", true);
                    $('table[id="MyGrid"] tbody tr').addClass('warning');
                } else {
                    $(this).prop('checked', false);
                    $('.selectrows').prop('checked', false);
                    $('table[id="MyGrid"] tbody tr').removeClass('warning');
                    $('.userDelete').prop('disabled', 'true');
                }
            });
        },

        /*Row handling*/
        rowSelected: function(e) {
            $($(e.target).closest('input[type="checkbox"]')).prop('checked', function() {
                if (this.checked) {
                    $(e.target).closest('tr').addClass('warning selectedRow');
                    globalSelected.push($(e.target).closest('input[type="checkbox"]').attr('data-id'));
                    checkCounter++;
                    if (checkCounter > 0) {
                        $('.userDelete').removeProp('disabled').removeClass('disabled');
                    }

                } else {
                    checkCounter--;
                    if (checkCounter === 0) {
                        $('.userDelete').prop('disabled', 'true');
                    }
                    $('.selectrows').prop('checked', function() {
                        if ($(e.target).closest('tr').hasClass('error')) {
                            $(e.target).closest('tr').removeClass('error selectedRow');
                        } else {
                            $(e.target).closest('tr').removeClass('warning selectedRow');
                        }
                    });
                    globalSelected.pop($(e.target).closest('input[type="checkbox"]').attr('data-id'));
                }
            });
        },

        rowSelectedDelete: function() {
            $('.selectrows').prop('checked', function() {
                if (this.checked) {
                    $(this).parent().parent().removeClass('warning').addClass('error');
                }
            });
        },

        rowSelectedNotDelete: function() {
            $('.selectrows').prop('checked', function() {
                if (this.checked) {
                    $(this).parent().parent().removeClass('error').addClass('warning');
                }
            });
        }

    });
});