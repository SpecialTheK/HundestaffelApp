import {Position} from './position';
import {Marker} from './marker';
import {ColoredCircle} from './coloredCircle';
import {Triangle} from './triangle';
import {isArray} from "ionic-angular/util/util";

import {Observable} from "rxjs";

const color: string[] = [
	'#ff0000',
	'#00ff00',
	'#0000ff',
	'#ff00ff',
	'#ffff00',
	'#00ffff',
];

/**
 * Class defining the Trails used throughout the application.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Trail {
	id: number;

	/**
	 * The name of the trainer recording this trail.
	 *
	 * @since 1.0.0
	 */
	trainer: string;

	/**
	 * The name of the dog walking this trail.
	 *
	 * @since 1.0.0
	 */
	dog: string;

	/**
	 * The time the recording of this trail was started.
	 *
	 * @since 1.0.0
	 */
	startTime: Date;

	/**
	 * The time the recoding was stopped.
	 *
	 * @since 1.0.0
	 */
	endTime: Date;

	/**
	 * Distance of this trail.
	 *
	 * @since 1.0.0
	 */
	distance: number = 0;

	/**
	 * Array containing all tracked positions.
	 *
	 * @since 1.0.0
	 */
	path: Position[];

	/**
	 * Array containing all added markers.
	 *
	 * @since 1.0.0
	 */
	marker: Marker[];

	/**
	 * Array containing all added circles.
	 *
	 * @since 1.0.0
	 */
	circles: ColoredCircle[];

	/**
	 * Array containing all triangles.
	 *
	 * @since 1.0.0
	 */
	triangles: Triangle[];

	/**
	 * Color the trail is displayed in.
	 *
	 * @since 1.0.0
	 */
	trailColor: string;


	constructor(id: number, trainer: string, dog: string){
		this.id = id;
		this.trainer = trainer;
		this.dog = dog;
		this.startTime = new Date();
		this.distance = 0;
		this.path = [];
		this.marker = [];
		this.circles = [];
		this.triangles = [];

		this.trailColor = color[this.id%this.trailColor.length];
	}

	/**
	 * Method to add a new position to the path array.
	 *
	 * @param {number} lat The latitude of the position.
	 * @param {number} lng The longitude of the position.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addToPath(lat: number, lng: number){
		this.path.push(new Position(lat, lng));
	}

	/**
	 * Method to add a new marker to the marker array.
	 *
	 * @param {string} title The title of the new marker.
	 * @param {number} markerSymbolID The symbol of the new marker.
	 * @param {number} lat The latitude of the new marker.
	 * @param {number} lng The longitude of the new marker.
	 * @returns {Marker} New marker object to manipulate it.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addMarker(title: string, markerSymbolID: number, lat: number, lng: number): Marker{
		let mar = new Marker(this.marker.length, new Position(lat, lng), title, markerSymbolID);
		this.marker.push(mar);

		return mar;
	}

	/**
	 * Method to add a new circle to the circles array.
	 *
	 * @param {string} color The color of the new circle.
	 * @param {number} opacity The opacity of the new circle.
	 * @param {number} lat The latitude of the new circle.
	 * @param {number} lng The longitude of the new circle.
	 * @returns {ColoredCircle} The new circle object to manipulate it.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addCircle(color: string, opacity: number, lat: number, lng: number): ColoredCircle{
		let cir = new ColoredCircle(this.circles.length, new Position(lat, lng), color, opacity);
		this.circles.push(cir);

		return cir;
	}

	/**
	 * Method to add a new triangle to the triangles array.
	 *
	 * @param {number} lat The latitude of the new triangle.
	 * @param {number} lng The longitude of the new triangle.
	 * @returns {Triangle} The new triangle object to manipulate it.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addTriangle(lat: number, lng: number): Triangle{
		let tri = new Triangle(this.triangles.length, new Position(lat, lng));
		this.triangles.push(tri);

		return tri;
	}

	/**
	 * Method to hide or show this trail.
	 *
	 * @param map
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	toggleOnMap(map: any = null){
		//NOTE (christian): wenn keine werte übergeben werden, dann wird der trail von der map entfernt. wenn google und map übergeben werden, dann wird der trail angezeigt!
	}

	/**
	 * Get the last recorded position from the positions array.
	 *
	 * @returns {Position}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	getLastPosition(): Position{
		return this.path[this.path.length - 1];
	}

	/**
	 * Get an observable containing an array with all positions of this trail.
	 *
	 * @returns {Observable<Position[]>}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	getPath(): Observable<Position[]>{
		return new Observable<Position[]>((observ) => {
			observ.next(this.path);
		});
	}

	/**
	 * Sets the start time of the trail
	 *
	 * @returns {Object}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setStartTime(){
		this.startTime = new Date();
	}


	/**
	 * Sets the end time of the trail
	 *
	 * @returns {Object}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setEndTime(){
		this.endTime = new Date();
	}

	/**
	 * Convert this trail into a simple object without any methods in order to store it via JSON.stringify()
	 *
	 * @returns {Object}
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
			distance: this.distance,
			trainer: this.trainer,
			dog: this.dog,
			path: pat,
			marker: mar,
			circles: cir,
			triangles: tri
		};
	}

	/**
	 * Static method to turn a simple object into an instance of this class.
	 *
	 * @param {Trail} data The data to use when creating the new instance.
	 * @param google
	 * @param map
	 * @returns {Trail}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	static fromData(data: Trail, google: any = null, map: any = null){
		if(Trail.isTrailObject(data)){
			let trail = new Trail(data.id, data.trainer, data.dog);
			trail.startTime = data.startTime;
			trail.endTime = data.endTime;
			trail.distance = data.distance;

			let _polyline, _polylinePath;
			if(google != null && map != null){
				_polyline = new google.maps.Polyline({
					strokeColor: trail.trailColor,
					strokeOpacity: 1.0,
					strokeWeight: 3
				});
				_polyline.setMap(map);
				_polylinePath = _polyline.getPath();
			}

			for(let p of data.path){
				trail.addToPath(p.lat, p.lng);
				if(google != null && map != null) {
					_polylinePath.push(new google.maps.LatLng(p.lat, p.lng));
				}
			}
			for(let mar of data.marker){
				let m = trail.addMarker(mar.title, mar.symbolID, mar.position.lat, mar.position.lng);
				if(google != null && map != null) {
					m.addToMap(google, map);
				}
			}
			for(let cir of data.circles){
				let c = trail.addCircle(cir.color, cir.opacity, cir.position.lat, cir.position.lng);
				if(google != null && map != null) {
					c.addToMap(google, map);
				}
			}
			for(let tri of data.triangles){
				let t = trail.addTriangle(tri.position.lat, tri.position.lng);
				if(google != null && map != null) {
					t.addToMap(google, map);
				}
			}
			return trail;
		}

		return null;
	}

	/**
	 * Method to check whether the passed object can be converted into an instance of this class or not.
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
			if(!entry.hasOwnProperty('distance')){
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
