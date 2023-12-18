import { M } from "./js/model.js";
// import { V } from "./js/view.js";

import Highcharts from 'highcharts';
   

// loadind data (and wait for it !)
await M.init();


let C = {};



C.init = function(){
  Highcharts.chart('it-1', {

    chart: {
        type: 'bar'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
        }
    },

    legend: {
        enabled: false
    },

    subtitle: {
        text: '2021'
    },

    title: {
        text: 'Top 10 Countries by Population'
    },

    tooltip: {
        shared: true
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Population'
        }
    },

    series: [{
        name: 'Population',
        data: M.getRoomByHours(),
    }]

});
};



C.init()