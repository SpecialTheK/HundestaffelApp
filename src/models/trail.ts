import {Position} from './position';
import {Marker} from './marker';
import {ColoredCircle} from './coloredCircle';
import {Triangle} from './triangle';

export class Trail {

	startTime: number;
	endTime: number;
	isLandActivity: boolean;
	isSharedActivity: boolean;
	isTraining: boolean;

	trainer: string;
	dog: string;
	path: Position[] = [];
	marker: Marker[] = [];
	circles: ColoredCircle[] = [];
	triangles: Triangle[] = [];

	constructor(trainer: string, dog: string, isLandActivity: boolean, isSharedActivity: boolean, isTraining: boolean) {
		this.trainer = trainer;
		this.dog = dog;
		this.isLandActivity = isLandActivity;
		this.isSharedActivity = isSharedActivity;
		this.isTraining = isTraining;
	}

	setStartTime(startTime: number){
		this.startTime = startTime;
	}

	setEndTime(endTime: number){
		this.endTime = endTime;
	}

	addToPath(pos: Position){
		this.path.push(pos);
	}

	addToMarker(marker: Marker){
		this.marker.push(marker);
	}

	addToCircles(circle: ColoredCircle){
		this.circles.push(circle);
	}

	addToTriangles(triangle: Triangle){
		this.triangles.push(triangle);
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
	
	static convertToTrailObject(object: any):Trail{
		if(this.isTrailObject(object)){
			let newTrail = new Trail(object.trainer, object.dog, object.isLandActivity, object.isSharedActivity, object.isTraining);
			newTrail.startTime = object.startTime;
			newTrail.endTime = object.endTime;
			
			for(let p of object.path){
				newTrail.path.push(new Position(p.lat, p.lng));
			}
			
			for(let m of object.marker){
				let newMarker = new Marker(m.google, m.map, m.id, new Position(m.position.lat, m.position.lng), m.title, m.symbolID);
				newMarker.map_marker = m.map_marker;
				newTrail.marker.push(newMarker);
			}
			
			for(let c of object.circles){
				let newCircle = new ColoredCircle(c.google, c.map, c.id, new Position(c.position.lat, c.position.lng), c.color, c.opacity);
				newCircle.radius = c.radius;
				newTrail.circles.push(newCircle);
			}
			
			for(let t of object.triangles){
				let newTriangle = new Triangle(t.google, t.map, t.id, new Position(t.position.lat, t.position.lng));
				newTriangle.map_triangle = t.map_triangle;
				newTrail.triangles.push(newTriangle);
			}
			return newTrail;
		}
		return null;
	}
	
	static isTrailObject(object: any){
		return (object.hasOwnProperty('trainer') && object.hasOwnProperty('dog') && object.hasOwnProperty('path') &&
			object.hasOwnProperty('marker') && object.hasOwnProperty('circles') && object.hasOwnProperty('triangles') &&
			object.hasOwnProperty('startTime') && object.hasOwnProperty('endTime') && object.hasOwnProperty('isLandActivity') &&
			object.hasOwnProperty('isSharedActivity') && object.hasOwnProperty('isTraining'));
	}
}
