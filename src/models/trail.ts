import {Position} from './position';
import {Marker} from './marker';
import {ColoredCircle} from './coloredCircle';
import {Triangle} from './triangle';

export class Trail {

	google: any;
	map: any;

	startTime: number;
	endTime: number;
	isLandActivity: boolean;
	isSharedActivity: boolean;
	isTraining: boolean;

	id: number;
	isHidden: boolean = false;

	trainer: string;
	dog: string;
	path: Position[] = [];
	marker: Marker[] = [];
	circles: ColoredCircle[] = [];
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
	*/
	init(google: any, map: any){
		this.google = google;
		this.map = map;
	}

	/**
	* Imports a given trail with all its properties
	*
	* @param {Trail} trail The Trail object that gets imported.
	*/
	importTrail(trail: Trail){
		//TODO:	Schau ob man diese Werte(trainer, dog, usw. ) wirklich setzten will/muss
		this.trainer = trail.trainer;
		this.dog = trail.dog;
		this.isLandActivity = trail.isLandActivity;
		this.isSharedActivity = trail.isSharedActivity;
		this.isTraining = trail.isTraining;
		this.id = trail.id;

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

	setStartTime(startTime: number){
		this.startTime = startTime;
	}

	setEndTime(endTime: number){
		this.endTime = endTime;
	}

	addToPath(lat: number, lng: number){
		this.path.push(new Position(lat, lng));
	}

	getLastPos(): Position{
		return this.path[this.path.length - 1];
	}

	addToMarker(title: string, markerSymbol: number, position: Position = this.getLastPos()){
		this.marker.push(new Marker(this.google, this.map, this.marker.length, position, title, markerSymbol));
	}

	addToCircles(color: string, opacity: number, position: Position = this.getLastPos()){
		this.circles.push(new ColoredCircle(this.google, this.map, this.circles.length, position, color, opacity));
	}

	addToTriangles(position: Position = this.getLastPos()){
		this.triangles.push(new Triangle(this.google, this.map, this.triangles.length, position));
	}

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

	static isTrailObject(object: any){
		return (object.hasOwnProperty('trainer') && object.hasOwnProperty('dog') && object.hasOwnProperty('path') &&
			object.hasOwnProperty('marker') && object.hasOwnProperty('circles') && object.hasOwnProperty('triangles') &&
			object.hasOwnProperty('startTime') && object.hasOwnProperty('endTime') && object.hasOwnProperty('isLandActivity') &&
			object.hasOwnProperty('isSharedActivity') && object.hasOwnProperty('isTraining'));
	}
}
