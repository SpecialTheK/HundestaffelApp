import { Trail } from './trail';
import { Person } from './person';
import { BehaviorSubject, Observable, Subscription } from "rxjs";

export class TrailSet {

    //TODO (christian): wetter?

    creationID: any;

    person: Person;

    isLandTrail: boolean;

    situation: string;
    preSituation: string;
    risks: string;

    trails: Trail[] = [];
    currentTrail: Trail;

    constructor(person: Person, isLandTrail: boolean, situation: string, preSituation: string, risks: string, trainer: string, dog: string){
        this.person = Person.fromData(person);
        this.isLandTrail = isLandTrail;
        this.situation = situation;
        this.preSituation = preSituation;
        this.risks = risks;

        this.currentTrail = new Trail(0, trainer, dog, isLandTrail, false, false);
    }

    getCurrentTrail(){
        return new Observable<Trail>((observ) => {
            observ.next(this.currentTrail);
        });
    }

    convertToSimpleObject(){
        //TODO (christian): ist es gut den currenttrail direkt in trails zu pushen?
        this.trails.push(this.currentTrail);

        let _trails : any[] = [];
        this.trails.forEach((t) => {
            _trails.push(t.convertToSimpleObject());
        });

        let _person = this.person.convertToSimpleObject();

        return {
            creationID: this.creationID,
            isLandTrail: this.isLandTrail,
            situation: this.situation,
            preSituation: this.preSituation,
            risks: this.risks,
            person: _person,
            trails: _trails
        };
    }

    static fromData(data: TrailSet, google: any = null, map: any = null): TrailSet{
        //TODO (christian): wo kommen diese werte her und wo müssen sie hin? (trainer, dog)
        let trailSet = new TrailSet(data.person, data.isLandTrail, data.situation, data.preSituation, data.risks, "Trainer", "Hund");
        for(let trail of data.trails){
            trailSet.trails.push(Trail.fromData(trail, google, map));
        }
        return trailSet;
    }

    static isTrailObject(object: any): boolean {
        let isTrail = true;

        if(!object.hasOwnProperty('creationID')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('person')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('isLandTrail')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('situation')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('preSituation')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('risks')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('trails')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('currentTrail')){
            isTrail = false;
        }

        return isTrail;
    }

}
