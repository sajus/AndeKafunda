define(function(require) {
    "use strict";
    var Backbone = require('backbone'),
        reportsTemplate = require('template!templates/reports/reportsView');

    /*Google Pie charts*/
    require('https://www.google.com/jsapi');

    return Backbone.View.extend({

        el: '.page',

        render: function() {
            google.load('visualization', '1', {
                'callback': this.drawChart,
                'packages': ['corechart']
            });
            this.$el.html(reportsTemplate());
        },

        drawChart: function(_name) {
            if(!_name) _name = "Status"; //DEFAULT VALUE IF THERE IS NO NAME;
             var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work', 11],
                ['Eat', 2],
                ['Commute', 2],
                ['Watch TV', 2],
                ['Sleep', 7]
            ]);
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            var options = {
                title: 'Interviews '+_name,
                is3D: true,
                backgroundColor: '#EEE',
                stroke: '#FAFAFA'
            };
            chart.draw(data, options);
            // $.get('/report'+_name)
            // .success(function(data) {
            //     chart.draw(google.visualization.arrayToDataTable(data.data), options);
            // }).fail(function() {
            // });
        }
    });
});