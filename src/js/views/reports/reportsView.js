define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        reportsTemplate = require('template!templates/reports/reportsView'),
        tooltipTemplate = require('template!templates/reports/tooltip'),
        services = require('services');

    /*Google Pie charts*/
    require('https://www.google.com/jsapi');

    return Backbone.View.extend({

        el: '.page',
        initialize: function() {
            var self = this;
            services.getResponsesByGreetIdCountAll().done(function(data) {
                self.data = data;
                self.render();
            });
        },
        render: function() {
            console.log(this.data);
            this.$el.html(reportsTemplate());
            google.load('visualization', '1', {
                'callback': this.drawChart.bind(this),
                'packages': ['corechart']
            });
            return this;
        },

        drawChart: function() {
            var dataTable = new google.visualization.DataTable(),
                rows = [];
            dataTable.addColumn('string', 'Greeting')
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
            var chart = new google.visualization.BarChart(document.getElementById('chart'));
            var options = {
                title: "Summary of votes for all greetings",
                width: 1000,
                height: 600,
                vAxis: {
                    title: "Greetings"
                },
                focusTarget: 'category',
                tooltip: {
                    isHtml: true
                },
                hAxis: {
                    title: "Counts"
                }
            };
            chart.draw(dataTable, options);
        }
    });
});