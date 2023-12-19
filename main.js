import { M } from "./js/model.js";
// import { V } from "./js/view.js";

import Highcharts from 'highcharts';
   

// loadind data (and wait for it !)
await M.init();


let C = {};



C.init = function(){

    let data = []

    let se = document.querySelector("#selectYT");
    se.addEventListener("change", C.handler_changeOnData)




  // Itération 1
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

// Itération 2
C.createChart2(M.getRoomByYear())
 
};

C.createChart2 = function(data){
    Highcharts.chart('it-2', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Volume horaire par année de formation'
        },
        xAxis: {
            categories: M.getRoomNames(),
            title: {
              text: 'Salles'
          }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Heures'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: data
      });
}

C.handler_changeOnData = function(ev){
    console.log(ev)
        if(ev.target.value == 'years'){
            let data = M.getRoomByYear()
       
            C.createChart2(data);
        }

        if(ev.target.value == 'type'){
            let data = M.getRoomByType()
            
            C.createChart2(data);
        }

}


C.init()