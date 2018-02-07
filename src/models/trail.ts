import {Position} from '../models/position';
import {Marker} from '../models/marker';
import {ColoredCircle} from '../models/coloredCircle';
import {Triangle} from '../models/triangle';

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
}
