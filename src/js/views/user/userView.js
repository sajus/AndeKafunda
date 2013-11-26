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
    require('bootstrapModal');
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
            'change .selectUsersAtOnce': 'gridCheckBox',
            'click .selectrows': 'rowSelected',
            /*Edit handler*/
            'click .userEdit': 'userEdit',
            /*Delete handler*/
            'click .userDelete': 'userDelete',
            'click .confirmDelete': 'confirmDelete',
            'click .cancelDelete': 'cancelDelete',
            /*Create handler*/
            'click .create': 'create',
            /*Summary handler*/
            'click .summary': 'userTblSummary',
            'click .printUserSummary': 'printUserSummary'
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
                operationHTML = '',
                editOp = '<a href="#" title="Edit" class="userEdit"><span class="glyphicon glyphicon-edit"></span></a> &nbsp; &nbsp;',
                delOp = '<a href="#" title="Delete" class="userDelete"><span class="glyphicon glyphicon-remove txt-danger"></span></a>';

            _.each(Userlist, function(userlist) {
                var isSelf = parseInt(cookieManager.checkEmpid(), 10) === userlist.id;
                if(!isSelf){
                    operationHTML = editOp + delOp;
                }else{
                    operationHTML = editOp;
                }
                userlist.selectRows = !isSelf ? "<input type='checkbox' class='selectrows'>" : "";
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
                    label: "<input type='checkbox' class='selectUsersAtOnce'>",
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
                firstname = targetRow$.find('td').eq(2).text(),
                lastname = targetRow$.find('td').eq(3).text(),
                email = targetRow$.find('td').eq(4).text(),
                accesstype = (targetRow$.find('td').eq(5).text() === 'Admin')? true : false,
                userEdit;

            this.createEditUserModel.set('id', id);
            this.createEditUserModel.set('accesstype', accesstype);
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
        userDelete: function(e) {
            e.preventDefault();
            var target$ = this.$(e.target);
            if(target$[0].tagName.toLowerCase() === 'span' || target$[0].tagName.toLowerCase() === 'a'){
                target$.closest('tr').addClass('warning').find('td').first().find('input').attr('checked', true);
            }
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
                Events.trigger("alert:error", [{
                    message: model.statusText
                }]);
            });
        },

        cancelDelete:function(e){
            this.$('#MyGrid').find('tr.warning').each(function(){
                $(this).removeClass('warning');
                $(this).find('td').first().find('input').attr('checked', false);
            });
            this.$('.selectUsersAtOnce').attr('checked', false);
            this.$('thead').find('.createDeleteheader button.userDelete').attr('disabled', true);
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

        /*Summary print handling*/
        printUserSummary: function() {
            var DocumentContainer = this.$('.summaryModal'),
                WindowObject = window.open('', 'PrintWindow', 'width=1000,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
            WindowObject.document.writeln(DocumentContainer.html());
            console.log(DocumentContainer.html());
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();
        },

        /*Checkbox handling*/
        gridCheckBox: function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.selectUsersAtOnce').prop('checked', function() {
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
                    $('.userDelete').prop('disabled', 'true').addClass('disabled');
                }
            });
        },

        /*Row handling*/
        rowSelected: function(e) {
            var target$ = this.$(e.target),
                closestCheckbox = target$.closest('input[type="checkbox"]'),
                closestTr = target$.closest('tr'),
                userDelete$ = this.$('.userDelete');
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
                    if (checkCounter === 0) {
                        userDelete$.prop('disabled', true).addClass('disabled');
                    }
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
        },

        onClose: function() {
            Events.off(null, null, this);
        }

    });
});