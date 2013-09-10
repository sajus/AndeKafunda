define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        reportsTemplate = require('template!templates/reports/reportsView'),
        tooltipTemplate = require('template!templates/reports/tooltip'),
        UsersCollection = require('collections/user/userCollection'),
        UserNotVotedView = require('views/reports/userNotVotedView'),
        _ = require('underscore'),
        services = require('services');

    /*Google Pie charts*/
    require('https://www.google.com/jsapi');

    return Backbone.View.extend({

        el: '.page',
        initialize: function() {
            var self = this;
            services.getResponsesByGreetIdCountAll().done(function(data) {
                self.data = data;
                self.designersCollection = new UsersCollection({
                    isDesigner: true
                });
                self.usersCollection = new UsersCollection({
                    isDesigner: false
                });
                $.when(self.designersCollection.fetch(), self.usersCollection.fetch()).done(function() {
                    self.render();
                });
            });
        },
        events: {
            'change .users': 'userChanged',
            'change .designers': 'designerChanged',
            'click .usersNotVoted': 'usersNotVoted'
        },
        userChanged: function(e) {
            console.log("User changed");
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
                users: this.usersCollection.toJSON()
            }));
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
                self.$('.modal').modal({
                    backdrop: 'static'
                });
            });
        }
    });
});