import { M } from "./js/model.js";
// import { V } from "./js/view.js";

import Highcharts from 'highcharts';
import HighchartsSunburst from 'highcharts/modules/sunburst';
import HighchartsHeatmap from 'highcharts/modules/heatmap';

// Initialisez le module Heatmap
HighchartsHeatmap(Highcharts);

// Initialisez le module Sunburst
HighchartsSunburst(Highcharts);
   

// loadind data (and wait for it !)
await M.init();


let C = {};



C.init = function(){
    //Itération 1 
    C.createChart('it-1', M.getRoomByHours());
    // Itération 2
    C.createStackedBar('it-2', M.getRoomByYear(), 'année de formation')

    // Itération 3
    C.createSunburst('it-3', M.getRessourceByRoom('101'), window.innerHeight, window.innerWidth/2)

    // Itération 4
    C.createHeatMap('it-4', M.getRoomByWeek())

    let seyt = document.querySelector("#selectYT");
    seyt.addEventListener("change", C.handler_changeOnYearType)

    let ser = document.querySelector("#selectRoom");
    ser.addEventListener("change", C.handler_changeOnRoom)

};


C.createChart = function(where, data){
  // Itération 1
  Highcharts.chart(where, {

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
        data: data,
    }]

});
}

C.createStackedBar = function(where, data, dataType){
    Highcharts.chart(where, {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Volume horaire par ' + dataType
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



C.createSunburst = function(where, data, h, w){
    Highcharts.chart(where, {
        chart: {
        type: 'sunburst',
        height: h, 
        width: w,
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
   
        C.createStackedBar('it-2', data, 'année de formation');
    }

    if(ev.target.value == 'type'){
        let data = M.getRoomByType()
        
        C.createStackedBar('it-2', data, 'type de cours');
    }

}

C.handler_changeOnRoom = function(ev){

    let room = ev.target.value
    C.createSunburst('it-3', M.getRessourceByRoom(room));
        

}



C.createHeatMap = function(where, data){
    Highcharts.chart(where, {

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
    
    
        title: {
            text: "Taux d'occupation par salle par semaine (en %)",
            style: {
                fontSize: '1em'
            }
        },
    
        xAxis: {
            categories: M.getWeeks(),
        },
    
        yAxis: {
            categories: M.getRoomNames(),
            title: null,
            reversed: true
        },
    
        accessibility: {
            point: {
                descriptionFormat: '{(add index 1)}. ' +
                    '{series.xAxis.categories.(x)} sales ' +
                    '{series.yAxis.categories.(y)}, {value}.'
            }
        },
    
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },
    
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
    
        tooltip: {
            format: 'Semaine <b>{series.xAxis.categories.(point.x)}</b><br>' +
                    '<b>{series.yAxis.categories.(point.y)}</b><br>'+
                    '<b>{point.value}</b> %' 
        },
    
        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: data,
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    yAxis: {
                        labels: {
                            format: '{substr value 0 1}'
                        }
                    }
                }
            }]
        }
    
    });
}



C.init()