import {Position} from './position';
import {Marker} from './marker';
import {ColoredCircle} from './coloredCircle';
import {Triangle} from './triangle';
import {isArray} from "ionic-angular/util/util";

/**
 * Class defining the Trails used throughout the application.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Trail {

	google: any;
	map: any;
	
	/**
	 * The time the recording of this trail was started.
	 *
	 * @since 1.0.0
	 */
	startTime: number;
	
	/**
	 * The time the recording of this trail was stopped.
	 *
	 * @since 1.0.0
	 */
	endTime: number;
	
	/**
	 * Defines whether this trail uses the land or water map.
	 *
	 * @since 1.0.0
	 */
	isLandActivity: boolean;
	
	/**
	 * Defines whether this trail was imported or not.
	 *
	 * @since 1.0.0
	 */
	isSharedActivity: boolean;
	
	/**
	 * Defines whether this trail is a training or operation.
	 *
	 * @since 1.0.0
	 */
	isTraining: boolean;
	
	/**
	 * Id of this trail.
	 *
	 * @since 1.0.0
	 */
	id: number;
	
	/**
	 * Defines whether this trail is hidden while viewing it in a trailSet.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	isHidden: boolean = false;
	
	/**
	 * Name of the trainer of this trail
	 *
	 * @since 1.0.0
	 */
	trainer: string;
	
	/**
	 * Name of the dog of this trail.
	 *
	 * @since 1.0.0
	 */
	dog: string;
	
	/**
	 * Array containing all positions that were recorded.
	 *
	 * @type {Position[]}
	 * @since 1.0.0
	 */
	path: Position[] = [];
	
	/**
	 * Array containing all markers that were set.
	 *
	 * @type {Marker[]}
	 * @since 1.0.0
	 */
	marker: Marker[] = [];
	
	/**
	 * Array containing all circles that were set.
	 *
	 * @type {ColoredCircle[]}
	 * @since 1.0.0
	 */
	circles: ColoredCircle[] = [];
	
	/**
	 * Array containing all triangles that were set.
	 *
	 * @type {Triangle[]}
	 * @since 1.0.0
	 */
	triangles: Triangle[] = [];

	constructor(id: number, trainer: string, dog: string, isLandActivity: boolean, isSharedActivity: boolean, isTraining: boolean) {
		this.id = id;
		this.trainer = trainer;
		this.dog = dog;
		this.isLandActivity = isLandActivity;
		this.isSharedActivity = isSharedActivity;
		this.isTraining = isTraining;
	}

	/**
	* Sets the params google and map for use inside of a map context
	*
	* @param google Object for creating a displayable map components.
	* @param map Used for adding the created components to the map.
	* @since 1.0.0
	* @version 1.0.0
	*/
	init(google: any, map: any){
		this.google = google;
		this.map = map;
	}

	/**
	* Imports a given trail with all its properties
	*
	* @param {Trail} trail The Trail object that gets imported.
	* @since 1.0.0
	* @version 1.0.0
	*/
	importTrail(trail: Trail){
		//TODO:	Schau ob man diese Werte(trainer, dog, usw. ) wirklich setzten will/muss
		this.trainer = trail.trainer;
		this.dog = trail.dog;
		this.isLandActivity = trail.isLandActivity;
		this.isSharedActivity = trail.isSharedActivity;
		this.isTraining = trail.isTraining;
		this.id = trail.id;
		this.startTime = trail.startTime;
		this.endTime = trail.endTime;

		for(let pat of trail.path){
			this.addToPath(pat.lat, pat.lng);
		}
		for(let cir of trail.circles){
			this.addToCircles(cir.color, cir.opacity, cir.position);
		}
		for(let mar of trail.marker){
			this.addToMarker(mar.title, mar.symbolID, mar.position);
		}
		for(let tri of trail.triangles){
			this.addToTriangles(tri.position);
		}
	}
	
	/**
	 * Setter for the statTime
	 *
	 * @param {number} startTime
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setStartTime(startTime: number){
		this.startTime = startTime;
	}
	
	/**
	 * Setter for the endTime
	 *
	 * @param {number} endTime
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setEndTime(endTime: number){
		this.endTime = endTime;
	}
	
	/**
	 * Method to add a new position to the path array.
	 *
	 * @param {number} lat Latitude of the new position.
	 * @param {number} lng Longitude of the new position.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addToPath(lat: number, lng: number){
		this.path.push(new Position(lat, lng));
	}
	
	/**
	 * Getter to retrieve the last/latest position of the device during the recording.
	 *
	 * @returns {Position}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	getLastPos(): Position{
		return this.path[this.path.length - 1];
	}
	
	/**
	 * Method to add a new marker to the marker array.
	 *
	 * @param {string} title The title of the marker
	 * @param {number} markerSymbol The Id of the marker symbol.
	 * @param {Position} position The position of the new marker.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addToMarker(title: string, markerSymbol: number, position: Position = this.getLastPos()){
		this.marker.push(new Marker(this.google, this.map, this.marker.length, position, title, markerSymbol));
	}
	
	/**
	 * Method to add a new circle to the circles array.
	 *
	 * @param {string} color Color of the new circle.
	 * @param {number} opacity Opacity of the new circle.
	 * @param {Position} position Position of the new circle.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addToCircles(color: string, opacity: number, position: Position = this.getLastPos()){
		this.circles.push(new ColoredCircle(this.google, this.map, this.circles.length, position, color, opacity));
	}
	
	/**
	 * Method to add a new triangle to the triangles array.
	 *
	 * @param {Position} position Position of the new triangle.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addToTriangles(position: Position = this.getLastPos()){
		this.triangles.push(new Triangle(this.google, this.map, this.triangles.length, position));
	}
	
	/**
	 * Method to hide all circles below a certain opacity.
	 *
	 * @param {number} level The minimal opacity needed in order to be shown.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	hideCircleOn(level: number){
		for(let cir of this.circles){
			if(cir.opacity < level){
				cir.hide();
			}else {
				cir.show();
			}
		}
	}
	
	/**
	 * Method to hide all markers, circles and triangles.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	hide() {
		for(let mar of this.marker){
			mar.hide();
		}
		for(let cir of this.circles){
			cir.hide();
		}
		for(let tri of this.triangles){
			tri.hide();
		}
	}
	
	/**
	 * Method to show all markers, circles and triangles.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	show() {
		for(let mar of this.marker){
			mar.show();
		}
		for(let cir of this.circles){
			cir.show();
		}
		for(let tri of this.triangles){
			tri.show();
		}
	}
	
	/**
	 * Method to convert the trail into a normal object in order to save it via JSON.stringify().
	 *
	 * @returns {any}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(): any{
		let pat: any[] = [], mar: any[] = [], cir: any[] = [], tri: any[] = [];

		for(let p of this.path){
			pat.push(p.convertToSimpleObject());
		}

		for(let m of this.marker){
			mar.push(m.convertToSimpleObject());
		}

		for(let c of this.circles){
			cir.push(c.convertToSimpleObject());
		}

		for(let t of this.triangles){
			tri.push(t.convertToSimpleObject());
		}

		return {
			id: this.id,
			startTime: this.startTime,
			endTime: this.endTime,
			isLandActivity: this.isLandActivity,
			isSharedActivity: this.isSharedActivity,
			isTraining: this.isTraining,
			trainer: this.trainer,
			dog: this.dog,
			path: pat,
			marker: mar,
			circles: cir,
			triangles: tri
		};
	}
	
	/**
	 * Static method to define whether an object is a valid trailObject (doesn't check for methods).
	 *
	 * @param object The object to check.
	 * @returns {boolean}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	static isTrailObject(object: any) {
		let returnValue = true;
		if(!isArray(object)){
			object = [object];
		}
		object.forEach((entry) => {
			if(!entry.hasOwnProperty('id')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('startTime')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('endTime')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('isLandActivity')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('isSharedActivity')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('isTraining')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('trainer')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('dog')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('path')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('marker')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('circles')){
				returnValue = false;
			}
			if(!entry.hasOwnProperty('triangles')){
				returnValue = false;
			}
		});
		return returnValue;
	}
}
