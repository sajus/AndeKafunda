define(function(require) {

    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Events = require('events'),
        userTemplate = require('template!templates/user/userList'),
        FuelUxDataSource = require('fueluxDataSource'),
        CreateEditModel = require('models/user/userCreateEditModel'),
        UserEditView = require('views/user/userCreateEditView'),
        DeleteModal = require('models/user/userDelete'),
        userDeleteTemplate = require('template!templates/user/userDelete'),
        summaryUserModalTemplate = require('template!templates/user/userSummary'),
        cookieManager = require('utilities/cookieManager'),
        globalSelected = [],
        checkCounter = 0;

    /* Requires with no return */
    require('fueluxDataGrid');
    require('bootstrapDropdown');
    require('fueluxComboBox');
    require('fueluxSelectBox');
    require('fueluxSearchBox');

    return Backbone.View.extend({

        initialize: function() {
            Events.on("refreshView", this.render, this);
            this.createEditUserModel = new CreateEditModel();
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
            'click .create': 'create',
            /*Summary handler*/
            'click .summary': 'userTblSummary'
        },

        render: function() {
            this.$el.html(userTemplate({
                isAdmin: true
            }));
            var self = this;
            this.collection.fetch({
                success: function() {
                    self.createDataGrid(self.usersData(self.collection.toJSON()));
                }
            });
            return this;
        },

        /*Table Layout*/
        usersData: function(Userlist) {
            var userlistObj = {},
                userslistObj = [],
                operationHTML = '<button class="btn btn-small btn-primary userEdit" type="button"><i class="icon-edit icon-white"></i> Edit</button>';

            _.each(Userlist, function(userlist) {
                userlist.selectRows = (parseInt(cookieManager.checkEmpid(), 10) !== userlist.id)? "<input type='checkbox' class='selectrows'>" : "";
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
                    userlist.id,
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

            this.createEditUserModel.set('id', id);
            userEdit = new UserEditView({
                model: this.createEditUserModel,
                id: id
            });

            this.$('.modal-container').html(userEdit.render().el);
            this.$('.modal').modal({
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
            $('.warning').each(function() {
                deleteIndex.push($(this).find('td').eq(1).text());
            });
            this.createEditUserModel.set({
                id: deleteIndex
            });
            this.createEditUserModel.destroy().success(function(model,jqXhr) {
                self.$('.modal').modal('hide');
                self.render();
                Events.trigger("alert:success", [{
                    message: "Delete successful."
                }]);
            }).error(function(model,error) {
                console.log(model);
                console.log(error);
                Events.trigger("alert:error", [{
                    message: model.statusText
                }]);
            });
        },

        /*Create call*/
        create: function(e) {
            e.preventDefault();
            this.createEditUserModel.clear();
            var userCreate = new UserEditView({
                model: this.createEditUserModel
            });
            this.$('.modal-container').html(userCreate.render().el);
            this.$('.modal').modal({
                backdrop: 'static'
            });
        },

        /*Summary handling*/
        userTblSummary: function() {
            this.$('.modal-container').html(summaryUserModalTemplate);
            this.$('.modal').modal({ backdrop: 'static'});
            this.summaryData(this.collection.toJSON());
            $('.container').siblings('.table-bordered').addClass('addPrint');
        },

        summaryData: function(userlistData) {
            $('#admin').html((_.where(userlistData, {accesstype: true})).length);
            $('#normal').html((_.where(userlistData, {accesstype: false})).length);

            $('#totalUsers').html(userlistData.length);
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
                    $('tr .selectrows:checked').each(function() {
                        $(this).closest('tr').addClass('warning');
                    });
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
            var target$ = this.$(e.target),
                closestCheckbox = target$.closest('input[type="checkbox"]'),
                closestTr = target$.closest('tr');
            $(closestCheckbox).prop('checked', function() {
                if (this.checked) {
                    closestTr.addClass('warning selectedRow');
                    globalSelected.push(closestCheckbox.attr('data-id'));
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
                        if (closestTr.hasClass('error')) {
                            closestTr.removeClass('error selectedRow');
                        } else {
                            closestTr.removeClass('warning selectedRow');
                        }
                    });
                    globalSelected.pop(closestCheckbox.attr('data-id'));
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