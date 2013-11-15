define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        reportsTemplate = require('template!templates/reports/reportsView'),
        tooltipTemplate = require('template!templates/reports/tooltip'),
        UsersCollection = require('collections/user/userCollection'),
        UserNotVotedView = require('views/reports/userNotVotedView'),
        _ = require('underscore'),
        Events = require('events'),
        services = require('services');

    /*Google Pie charts*/
    require('https://www.google.com/jsapi');
    require('bootstrapModal');

    return Backbone.View.extend({

        el: '.page',
        initialize: function() {
            var self = this;
            services.getResponsesByGreetIdCountAll().done(function(data) {
                self.data = data;
                self.designersCollection = new UsersCollection({
                    isDesigner: true
                });
                services.getUsersVoted().done(function(data) {
                    self.userData = data;
                });
                $.when(self.designersCollection.fetch(), services.getUsersVoted()).done(function() {
                    self.render();
                });
            });
        },
        events: {
            'change .users': 'userChanged',
            'change .designers': 'designerChanged',
            'click .usersNotVoted': 'usersNotVoted',
            'click .printReport': 'printReport'
        },
        printReport: function() {
            var DocumentContainer = document.getElementById('chart'),
                WindowObject = window.open('', 'PrintWindow', 'width=1000,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
            WindowObject.document.writeln(DocumentContainer.innerHTML);
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();
        },
        userChanged: function(e) {
            var self = this;
            services.getResponsesGreetingsByEmpId({
                empid: parseInt(this.$(e.target).val(), 10)
            }).done(function(data) {
                self.data = data;
                self.drawChart();
            });
        },
        designerChanged: function(e) {
            var self = this;
            services.getResponsesByGreetIdCountAll({
                empid: parseInt(this.$(e.target).val(), 10)
            }).done(function(data) {
                self.data = data;
                self.drawChart();
            });
        },
        render: function() {
            this.$el.html(reportsTemplate({
                designers: this.designersCollection.toJSON(),
                users: this.userData
            }));
            Events.trigger('refreshActiveState');
            google.load('visualization', '1', {
                'callback': this.drawChart.bind(this),
                'packages': ['corechart']
            });
            return this;
        },

        drawChart: function() {
            var dataTable = new google.visualization.DataTable(),
                rows = [],
                chart = {},
                options = {};
            dataTable.addColumn('string', 'Greeting');
            dataTable.addColumn({
                'type': 'string',
                'role': 'tooltip',
                'p': {
                    'html': true
                }
            });
            dataTable.addColumn('number', 'Count');
            _.each(this.data, function(record) {
                var row = [],
                    designerName = record.tblUsers.firstname + ' ' + record.tblUsers.lastname + ' ( #' + record.id + ' )';
                row.push(designerName);
                row.push(tooltipTemplate({
                    imgUrl: record.url,
                    count: record.count,
                    designer: designerName
                }));
                row.push(record.count);
                rows.push(row);
            });
            dataTable.addRows(rows);
            chart = new google.visualization.BarChart(document.getElementById('chart'));
            options = {
                title: "Summary of votes for all greetings",
                width: 1000,
                height: 700,
                vAxis: {
                    title: "Greetings [ Artist (Greeting Id) ]"
                },
                focusTarget: 'category',
                tooltip: {
                    isHtml: true
                },
                hAxis: {
                    title: "Votes"
                }
            };
            chart.draw(dataTable, options);
        },

        usersNotVoted: function(e) {
            e.preventDefault();
            var userNotVotedView = new UserNotVotedView(),
                self = this;
            userNotVotedView.fetchData().done(function(data) {
                self.$('.modal-container').html(userNotVotedView.render(data).el);
                self.$('.modal').modal('show');
            });
            $('.container').siblings('.table-bordered').addClass('addPrint');
        }
    });
});