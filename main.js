import { M } from "./js/model.js";
import { V } from "./js/view.js";

import Highcharts from 'highcharts';
   

// loadind data (and wait for it !)
// await M.init();



let C = {};

C.init = function(){};
  

Highcharts.chart('container', {

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
      text: 'MMI'
  },
  
  title: {
      text: 'Volume horaire par salle'
  },
  
  tooltip: {
      shared: true
  },
  
  xAxis: {
      type: 'category'
  },
  
  yAxis: {
      title: {
          text: 'Heures'
      }
  },
  
  series: [{
      name: 'Heures',

      // getRoomByOrder();
      data: [{
          name: '101',
          y: 150
      }, {
          name: '102',
          y: 110
      }, {
          name: '103',
          y: 90
      }, {
          name: '115',
          y: 80
      }, {
          name: 'R01',
          y: 67
      }, {
          name: 'R02',
          y: 50
      }, {
          name: 'R03',
          y: 38
      }, {
          name: 'R04',
          y: 25
      }, {
          name: 'ADM132',
          y: 15
      }, {
          name: 'Autres',
          y: 10
      }]
  }]
  
  });

console.log('oui')

C.init()