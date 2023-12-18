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
        text: 'MMI Limoges'
    },

    title: {
        text: 'Heures de cours par salle'
    },

    tooltip: {
        shared: true
    },

    xAxis: {
      title: {
        text: 'Salles'
    },
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Heures'
        }
    },

    series: [{
        name: 'Heures',
        data: M.getRoomByHours(),
    }]

});
};



C.init()