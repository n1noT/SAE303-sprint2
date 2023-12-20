import { M } from "./js/model.js";
// import { V } from "./js/view.js";

import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';

HighchartsHeatmap(Highcharts);
   

// loadind data (and wait for it !)
await M.init();


let C = {};



C.init = function(){
    C.createChart();
    C.createChart2(M.getRoomByYear())
    C.createChart4();

    let se = document.querySelector("#selectYT");
    se.addEventListener("change", C.handler_changeOnData)
};


C.createChart = function(){





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
}

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








C.createChart4 = function(){
    Highcharts.chart('it-4', {

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
    
    
        title: {
            text: 'Volume horaire par salle par semaine',
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
                    '<b>{point.value}</b> heures' 
        },
    
        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: M.getRoomByWeek(),
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

console.log(M.getRoomNames())
console.log(M.getWeeks())
console.log(M.getRoomByWeek())

C.init()