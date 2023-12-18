

class Event {
    #id;
    #summary;
    #description;
    #start;
    #end;
    #location;
    #groups;
    #type;
    #ressource;
    #person;
    #duration;

    constructor(id, summary, description, start, end, location) {
        this.#id = id;
        this.#summary = summary.slice(0, summary.lastIndexOf(','));
        this.#description = description;
        this.#start = new Date(start);
        this.#end = new Date(end);
        this.#location = location;

        this.#groups = summary.slice(summary.lastIndexOf(',')+1);
        this.#groups = this.#groups.split('.');
        this.#groups = this.#groups.map( gr => gr.replace(/\s/g, "") );

        if( summary.includes('TD') ){
            this.#type = "TD";
        }

        else if( summary.includes('TP') ){
            this.#type = "TP";
        }

        else if( summary.includes('CM') ){
            this.#type = "CM";
        }
        else{
            this.#type = "Others";
        }

        const match = this.#summary.match(/^(R|(SA))[EÉ ]{0,2}[1-6](\.Crea)?(\.DWeb-DI)?\.[0-9]{2}/);
        this.#ressource = match ? match[0] : null;

        const matchperson = this.#summary.match(/^.*\d (.*)/);
        this.#person = matchperson ? matchperson[1].toLowerCase() : null;

        this.#duration = this.calculateDuration();

    }
    calculateDuration() {
        const durationInMilliseconds = this.#end - this.#start;
        return {
            milliseconds: durationInMilliseconds,
            seconds: Math.floor(durationInMilliseconds / 1000),
            minutes: Math.floor(durationInMilliseconds / (1000 * 60)),
            hours: Math.floor(durationInMilliseconds / (1000 * 60 * 60)),
        };
    }

    get ressource() {
        return this.#ressource;
    }

    get id() {
        return this.#id;
    }

    get summary() {
        return this.#summary;
    }

    get description() {
        return this.#description;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get location() {
        return this.#location;
    }

    get type() {
        return this.#type;
    }

    get groups() {
        return this.#groups.map( gr => gr); // retourne une copie du tableau
    }

    get person() {
        return this.#person;
    }

    get duration() {
        return this.#duration;
    }



    // retourne un objet contenant les informations de l'événement
    // dans un format compatible avec Toast UI Calendar (voir https://nhn.github.io/tui.calendar/latest/EventObject)
    toObject() {
        return {
            id: this.#id,
            title: this.#summary,
            body: this.#description,
            start: this.#start,
            end: this.#end,
            location: this.#location,
            groups: this.#groups,
            type: this.#type,
            ressource: this.#ressource,
            person: this.#person,
            duration: this.#duration,
        }
    }
}

export {Event};