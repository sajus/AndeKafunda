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
    require('bootstrapModal');
    require('fueluxDataGrid');
    require('bootstrapDropdown');
    require('fueluxComboBox');
    require('fueluxSelectBox');
    require('fueluxSearchBox');
    require('bootstrapTooltip');
    require('bootstrapPopOver');
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
            'mouseover .greetingDelete': 'rowSelectedDelete',
            'mouseout .greetingDelete': 'rowSelectedNotDelete',
            'click .greetingEdit': 'greetingEdit',
            'click .greetingCreate': 'greetingCreate',
            'click .greetingDelete': 'greetingDelete',
            // 'click .sendEmail': 'sendEmail',
            'click .cancelDelete': 'cancelDelete',
            'change .selectUsersAtOnce': 'gridCheckBox',
            'loaded #MyGrid': 'cleanSelectAll',
            'change .selectrows': 'rowSelected',
            // Tooltip
            'click .imgTooltip': 'preventDefault'
        },
        formatData: function(data) {
            var greetings = [],
                greeting,
                selectRows = "",
                operationHTML = "",
                editOp = '<a href="#" title="Edit" class="greetingEdit"><span class="glyphicon glyphicon-edit"></span></a> &nbsp; &nbsp;',
                delOp = '<a href="#" title="Delete" class="greetingDelete"><span class="glyphicon glyphicon-remove txt-danger"></span></a>';
            _.each(data, function(greetingModel) {
                var usersData = greetingModel.tblUsers[0];
                operationHTML = editOp + delOp;
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
                    "<a href=\"#\" class=\"imgTooltip\" data-img=\"" + greetingModel.url + "\" >" + greetingModel.url + "</a>",
                    operationHTML
                ]);
                // "<img src=\""+ greetingModel.url +"\" class=\"col-sm-2\" />",
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
            e.preventDefault();
            var target = this.$(e.target),
                greetingModel = new GreetingModel({
                    id: target.closest('tr').find('td').first().find('input').attr('data-id')
                }),
                greetingModal = new GreetingModal({
                    editMode: true,
                    model: greetingModel
                }),
                usersCollection = new UsersCollection(),
                self = this;
            greetingModal.fetchData().done(function() {
                console.log(greetingModal.model);
                usersCollection.fetch({
                    success: function() {
                        self.$('.modal-container').html(greetingModal.render(usersCollection.toJSON()).el);
                        self.$('.modal-container .modal').modal({
                            backdrop: 'static'
                        });
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
                    self.$('.modal-container .modal').modal({
                        backdrop: 'static'
                    });
                }
            });
        },
        greetingDelete: function(e) {
            e.preventDefault();
            var target$ = this.$(e.target);
            if (target$[0].tagName.toLowerCase() === 'span' || target$[0].tagName.toLowerCase() === 'a') {
                target$.closest('tr').addClass('warning').find('td').first().find('input').attr('checked', true);
            }
            var confirmDelete = new ConfirmModal();
            this.$('.modal-containerConfirm').html(confirmDelete.render().el);
            this.$('.modal-containerConfirm .modal').modal({
                backdrop: 'static'
            });
            // this.$('.modal-containerConfirm .modal').on('hidden',function(){
            //     console.log("in event");
            //     this.cancelDelete();
            // });
        },
        confirmedDelete: function() {
            var confirmModal$ = this.$('.modal-containerConfirm .modal'),
                greetingModel = new GreetingModel();
            greetingModel.set('id', globalSelected);
            greetingModel.destroy({
                success: function(model, responseText) {
                    Events.trigger("alert:success", [{
                        message: "Greeting deleted successfully."
                    }]);
                    setTimeout(function() {
                        confirmModal$.modal('hide');
                    }, 1500);
                    confirmModal$.on('hidden.bs.modal', function() {
                        Events.trigger('refreshView');
                    });
                }
            });
        },
        cancelDelete: function(e) {
            this.$('#MyGrid').find('tr.warning').each(function() {
                $(this).removeClass('warning');
                $(this).find('td').first().find('input').attr('checked', false);
            });
            this.$('.selectUsersAtOnce').attr('checked', false);
            this.$('thead').find('.createDeleteheader button.greetingDelete').attr('disabled', true);
        },
        cleanSelectAll: function() {
            var images = this.$('.imgTooltip'),
                self = this;
            this.$('.selectUsersAtOnce').prop('checked', false);
            setTimeout(function() {
                self.$('.imgTooltip').popover({
                    html: true,
                    placement: 'right',
                    trigger: 'hover',
                    content: function() {
                        return '<img width=\"150\" src="' + $(this).data('img') + '" />';
                    }
                });
            }, 200);
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
        preventDefault: function(e) {
            e.preventDefault();
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