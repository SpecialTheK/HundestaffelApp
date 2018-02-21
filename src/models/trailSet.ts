import { Trail } from './trail';
import { Person } from './person';

/**
 * Class defining the trailSet containing all trails for a single training/operation.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class TrailSet {
	/**
	 * The key used for storing this trailSet in the database.
	 *
	 * @since 1.0.0
	 */
	creationID: string;
	
	/**
	 * Defines whether the landMap or waterMap shall be used.
	 *
	 * @since 1.0.0
	 */
	isLandTrail: boolean;
	
	/**
	 * Defines whether this trailSet was shared for filtering purposes.
	 *
	 * @since 1.0.0
	 */
	isSharedTrail: boolean;
	
	/**
	 * Defines whether this trailSet is a training or operation.
	 *
	 * @since 1.0.0
	 */
	isTraining: boolean;
	
	/**
	 * Describes the situation for this operation.
	 *
	 * @since 1.0.0
	 */
    situation: string;
	
	/**
	 * Weather info.
	 *
	 * @since 1.0.0
	 */
	weather: string;
	
	/**
	 * @since 1.0.0
	 */
	risks: string;
	
	/**
	 * Description of the person to search for.
	 *
	 * @since 1.0.0
	 */
	person: Person;
	
	/**
	 * Array containing all trails in this trailSet.
	 *
	 * @type {Trail[]}
	 * @since 1.0.0
	 */
    trails: Trail[];

    constructor(isLandTrail: boolean, isSharedTrail: boolean, isTraining: boolean, situation: string, weather: string, risks: string, person: Person){
        this.isLandTrail = isLandTrail;
        this.isSharedTrail = isSharedTrail;
        this.isTraining = isTraining;
        this.situation = situation;
        this.weather = weather;
        this.risks = risks;
        this.person = person;
    	this.trails = [];
    }
	
	/**
	 * Method to add a new trail to this trailSet.
	 *
	 * @param {Trail} newTrail
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	public addTrailToSet(newTrail: Trail){
    	this.trails.push(newTrail);
    }
	
	/**
	 * Method to convert this class into a simple object without any methods in order to store it via JSON.stringify()
	 *
	 * @returns {Object}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(){
        let _trails : any[] = [];
        this.trails.forEach((t) => {
            _trails.push(t.convertToSimpleObject());
        });

        let _person = this.person.convertToSimpleObject();

        return {
            creationID: this.creationID,
            isLandTrail: this.isLandTrail,
            isSharedTrail: this.isSharedTrail,
	        isTraining: this.isTraining,
	        situation: this.situation,
	        weather: this.weather,
	        risks: this.risks,
	        person: _person,
	        trails: _trails
        };
    }
	
	/**
	 * Method used to convert a simple object into an instance of this class.
	 *
	 * @param {TrailSet} data The object contanining all data in order to create this trailSet.
	 * @param google
	 * @param map
	 * @returns {TrailSet|null} Returns the new trailSet if the data is in the right format, else returns null.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    static fromData(data: TrailSet, google: any = null, map: any = null): TrailSet{
    	if(TrailSet.isTrailObject(data)){
		    let trailSet = new TrailSet(data.isLandTrail, data.isSharedTrail, data.isTraining, data.situation, data.weather, data.risks, data.person);
		    for(let trail of data.trails){
			    trailSet.trails.push(Trail.fromData(trail, google, map));
		    }
		    return trailSet;
	    }
        return null;
    }
	
	/**
	 * Checks whether a passed object contains all attributes to be a trailSet.
	 *
	 * @param object The object to check.
	 * @returns {boolean}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	static isTrailObject(object: any): boolean {
        let isTrail = true;

        if(!object.hasOwnProperty('creationID')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('isLandTrail')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('isShardTrail')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('isTraining')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('situation')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('weather')){
            isTrail = false;
        }
        if(!object.hasOwnProperty('risks')){
            isTrail = false;
        }
	    if(!object.hasOwnProperty('person')){
		    isTrail = false;
	    }
	    if(!object.hasOwnProperty('trails')){
		    isTrail = false;
	    }

        return isTrail;
    }
}
