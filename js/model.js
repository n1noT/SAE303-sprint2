
import ical from 'ical';
import { EventManager } from './class/event-manager';

let Events = {
    mmi1: null,
    mmi2: null,
    mmi3: null
}

let Salles = {
    '101': [],
    '102': [],
    '103': [],
    'ADM132': [],
    'R01': [],
    'R02': [],
    'R03': [],
    'R04': [],
    'Labo': [],
    'Studio': [],
    
}

let M = {};





M.getEvents = function(annee) {
    if ( annee in Events ) {
        return Events[annee].toObject();
    }
    return null;
}

/* 
M.getConcatEvents

Fonction qui concatenne tous les événements de Events dans un seul tableau

*/

M.getConcatEvents = function() {

    let allEv = []

    for(let ev in Events){
        allEv = allEv.concat(Events[ev].toObject());

    }

    return allEv;
    
}

/* 
M.filterEventsByText

Fonction qui filtre les événements suivant les éléments d'une recherche et qui retourne une copie du tableau contenant ces événements

input : chaine de caractère qui va servir à filtrer

*/

M.filterEventsByText = function (input) {
    let res = [];

    let inputAllTerms = input.split(" ");

    for (let events of M.getConcatEvents()) {
        let match = true;  

        for (let inp of inputAllTerms) {
            let inlcus = false;  

            for (let elt in events) {
                if (events[elt].toString().toLowerCase().includes(inp.toLowerCase())) {
                    inlcus = true;
                    break;  
                }
            }

            if (inlcus == false) {
                match = false;
                break;  
            }
        }

        if (match == true ) {
            if (res.includes(events) == false) {
                res.push(events);
            }
        }
    }

    return structuredClone(res);
}

/*

M.getSalle

Fonction qui donne un tableau d'objets events selon le paramètre s (nom d'une salle)

*/

M.getSalle = function(s) {
    if ( s in Salles ) {
        return Salles[s];
    }
    return null;
}



M.init = async function() {
    let data = await fetch('./data/mmi1.ics');
    data = await data.text();
    data = ical.parseICS(data);
    Events.mmi1 = new EventManager('mmi1', 'MMI 1', 'Agenda des MMI 1');
    Events.mmi1.addEvents(data);

    let data2 = await fetch('./data/mmi2.ics');
    data2 = await data2.text();
    data2 = ical.parseICS(data2);
    Events.mmi2 = new EventManager('mmi2', 'MMI 2', 'Agenda des MMI 2');
    Events.mmi2.addEvents(data2);

    let data3 = await fetch('./data/mmi3.ics');
    data3 = await data3.text();
    data3 = ical.parseICS(data3);
    Events.mmi3 = new EventManager('mmi3', 'MMI 3', 'Agenda des MMI 3');
    Events.mmi3.addEvents(data3);

    let all = M.getConcatEvents();
    
    for(let s in Salles){
        Salles[s] = all.filter((event)=>{return event.location==s});
    
    }  
    

}

/*

M.getRoomByHours

Fonction qui donne un tableau d'objet avec comme paramètres name (nom de la salle) et y (nombres d'heures de cette salle qui est aussi sa coordonnées sur les courbes). Les objets sont triés par ordre décroissant selon le total d'heures associé.

*/

M.getRoomByHours = function(){
    let items = []

    for(let s in Salles){
        let total = 0
        for(let ev of Salles[s]){
            total += ev.duration.hours
        }
        // Coordonnées de la salle
        let salleCoor = {
            name: s,
            y: total
        };

        items.push(salleCoor);
    }
    // Tri par ordre décroissant selon le total d'heures
    items.sort((a, b) => b.y - a.y)

    return items
}

M.getRoomNames = function(s) {
    let tab = []
    for( s in Salles ) {
        tab.push(s);
    }
    return tab;
}

M.getRoomByYear = function(){
    let items = []

    let years = ['BUT1', 'BUT2', 'BUT3']

    //boucle les années
    for(let y of years){
        let data = []
        //boucle les salles
        for(let s in Salles){
        let total = 0
            //boucle les events par salles
            for(let ev of Salles[s]){
                //Si l'année de l'event corespond à l'année choisi
                if(ev.year == y){
                    total += ev.duration.hours
                    
                }
            } 
            
            data.push(total)

        }
        let yearCoor = {
            name: y,
            data: data //liste des totaux par salle selon l'année dans l'ordre de la base
        
        };
        items.push(yearCoor);
          
    }

    return items
}

M.getRoomByType= function(){
    let items = []

    let type = ['CM', 'TD', 'TP']

    //boucle les types
    for(let t of type){
        let data = []
        //boucle les salles
        for(let s in Salles){
        let total = 0
            //boucle les events par salles
            for(let ev of Salles[s]){
                //Si le type de l'event correspond au type choisi
                if(ev.type == t){
                    total += ev.duration.hours
                    
                }
            } 
            
            data.push(total)

        }
        let typeCoor = {
            name: t,
            data: data //liste des totaux par salle selon le type dans l'ordre de la base
        
        };
        items.push(typeCoor);
          
    }

    return items
}


//Je dois retrouver le numero de la semaine d'un évenement a partir de la date d'un évenement

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
}


//Visualiser le taux d’occupation de toutes les salles pour toutes les semaines de formation (la semaine est en abscisse et le nom des salles en ordonnée). On doit fournir au tableau de données une liste de coordonnées (x,y) pour chaque salle ainsi que son taux d'occupation par semaine.

M.getWeeks = function(){
    let weeks = []

    

    for(let ev of M.getConcatEvents()){
        let week = ev.start.getWeek()
        week = week.toString();
        if(weeks.includes(week) == false){
            weeks.push(week)
        }
    }

    return weeks.sort((a, b) => a - b)
}


M.getRoomByWeek = function(){
    let weeks = M.getWeeks(); // Get the list of weeks
    let rooms = M.getRoomNames(); // Get the list of room names
    let data = [];



// Je dois faire une boucle dans le but de filtrer les evenement present dans les différentes salles contenu dans l'objet Salles en retirant les évenments pour lesquelles leur parametre ressource contient "SA"



    // Loop through each week
    for (let weekIndex in weeks) {
        let week = weeks[weekIndex];

        // Loop through each room
        for (let roomIndex in rooms) {
            let room = rooms[roomIndex];
            let totalHours = 0;

            // Calculate the total hours for the room in the given week
            for (let ev of Salles[room]) {
                if (ev.start.getWeek().toString() === week) {
                    totalHours += ev.duration.hours;
                }
            }
            totalHours = totalHours/45*100;

            // Push the data point for the week and room
            data.push([parseInt(weekIndex), parseInt(roomIndex), Math.round(totalHours)]);
        }
    }

    return data;
}






export { M };

