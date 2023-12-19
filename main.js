import { M } from "./js/model.js";
// import { V } from "./js/view.js";

import Highcharts from 'highcharts';

import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsSunburst from 'highcharts/modules/sunburst';

// Initialisez le module Heatmap
HighchartsHeatmap(Highcharts);

// Initialisez le module Sunburst
HighchartsSunburst(Highcharts);



// loadind data (and wait for it !)
await M.init();


let C = {};



C.init = function(){

    let seyt = document.querySelector("#selectYT");
    seyt.addEventListener("change", C.handler_changeOnYearType)

    let ser = document.querySelector("#selectRoom");
    ser.addEventListener("change", C.handler_changeOnRoom)




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
C.createStackedBar('it-2', M.getRoomByYear())

// Itération 3
C.createSunburst('it-3', M.getRessourceByRoom('101'))

}

C.createStackedBar = function(where, data){
    Highcharts.chart(where, {
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


C.createSunburst = function(where, data){
    Highcharts.chart(where, {
        chart: {
        type: 'sunburst',
        height: 1000, 
        width: 1000,
        events: {
            click: function(event) {
            // Gérer l'événement de clic sur le graphique
            console.log(event.point.name); // Affiche le nom de l'élément cliqué
            }
        }
        },
        title: {
        text: 'Utilisation de la salle par semestre, ressources ou SAÉ, et type d\'utilisation'
        },
        series: [{
        type: 'sunburst',
        data: data
        }]
    });
}


C.handler_changeOnYearType = function(ev){
        if(ev.target.value == 'years'){
            let data = M.getRoomByYear()
       
            C.createStackedBar('it-2', data);
        }

        if(ev.target.value == 'type'){
            let data = M.getRoomByType()
            
            C.createStackedBar('it-2', data);
        }

}

C.handler_changeOnRoom = function(ev){

    let room = ev.target.value
    C.createSunburst('it-3', M.getRessourceByRoom(room));
        

}



C.init()