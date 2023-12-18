
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


export { M };


/*
    On notera que si tout ce qui est dans ce fichier concerne le modèle, seul ce qui est dans M est exporté (et donc accessible depuis l'extérieur).
    C'est une façon de faire qui permet de garder privé les données "réelles" qui sont dans Events mais dont la visibilité est limitée à ce module/fichier.
    Donc il faut voir M comme la partie publique de la vue et le reste comme la partie privée.
    C'est sensiblement différent de ce qu'on faisait jusqu'à présent où tout était dans l'objet M.
    L'utilisation des modules javascript nous permet ici de choisir ce que l'on veut rendre public ou privé.
    C'est une autre façon d'implémenter le concept d'encapsulation sans avoir à utiliser les classes.
    A noter qu'on aurait pu faire une classe "Model" mais dans la mesure où l'on n'aurait qu'une seule instance de Model, ce n'est pas vraiment utile.
    
*/