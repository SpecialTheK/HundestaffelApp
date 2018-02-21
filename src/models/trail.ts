import {Position} from './position';
import {Marker} from './marker';
import {ColoredCircle} from './coloredCircle';
import {Triangle} from './triangle';
import {isArray} from "ionic-angular/util/util";

import {Observable} from "rxjs";

/**
 * Class defining the Trails used throughout the application.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Trail {

	//NOTE (christian): die müssen hier drin sein (?)
	//==
	isLandActivity: boolean;
	isSharedActivity: boolean;
	isTraining: boolean;
	//==

	//DEBUG (christian): nur schnell was testen
	polyline: any;

	id: number;
	trainer: string;
	dog: string;

	startTime: number;
	endTime: number;

	distance: number;

	path: Position[] = [];
	marker: Marker[] = [];
	circles: ColoredCircle[] = [];
	triangles: Triangle[] = [];

	constructor(id: number, trainer: string, dog: string, isLandActivity: boolean, isSharedActivity: boolean, isTraining: boolean){
		this.id = id;
		this.trainer = trainer;
		this.dog = dog;
		this.isLandActivity = isLandActivity;
		this.isSharedActivity = isSharedActivity;
		this.isTraining = isTraining;
	}

	addToPath(lat: number, lng: number){
		this.path.push(new Position(lat, lng));
	}

	addMarker(title: string, markerSymbolID: number, lat: number, lng: number): Marker{
		let mar = new Marker(this.marker.length, new Position(lat, lng), title, markerSymbolID);
		this.marker.push(mar);

		return mar;
	}

	addCircle(color: string, opacity: number, lat: number, lng: number): ColoredCircle{
		let cir = new ColoredCircle(this.circles.length, new Position(lat, lng), color, opacity);
		this.circles.push(cir);

		return cir;
	}

	addTriangle(lat: number, lng: number): Triangle{
		let tri = new Triangle(this.triangles.length, new Position(lat, lng));
		this.triangles.push(tri);

		return tri;
	}

	toggleOnMap(map: any = null){
		//NOTE (christian): wenn keine werte übergeben werden, dann wird der trail von der map entfernt. wenn google und map übergeben werden, dann wird der trail angezeigt!
	}

	getLastPosition(): Position{
		return this.path[this.path.length - 1];
	}

	getPath(): Observable<Position[]>{
		return new Observable<Position[]>((observ) => {
			observ.next(this.path);
		});
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

	static fromData(data: Trail, google: any = null, map: any = null){
		let trail = new Trail(data.id, data.trainer, data.dog, data.isLandActivity, data.isSharedActivity, data.isTraining)

		let polyline = new google.maps.Polyline({
			strokeColor: "#ff0000",
			strokeOpacity: 1.0,
			strokeWeight: 3
		});

		for(let p of trail.path){
			trail.addToPath(p.lat, p.lng);
			let pp = polyline.getPath();
        	pp.push(new google.maps.LatLng(p.lat, p.lng));
		}
		for(let mar of trail.marker){
			let m = trail.addMarker(mar.title, mar.symbolID, mar.position.lat, mar.position.lng);
			if(google != null && map != null) {
				m.addToMap(google, map);
			}
		}
		for(let cir of trail.circles){
			let c = trail.addCircle(cir.color, cir.opacity, cir.position.lat, cir.position.lng);
			if(google != null && map != null) {
				c.addToMap(google, map);
			}
		}
		for(let tri of trail.triangles){
			let t = trail.addTriangle(tri.position.lat, tri.position.lng);
			if(google != null && map != null) {
				t.addToMap(google, map);
			}
		}

		return trail;
	}

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
