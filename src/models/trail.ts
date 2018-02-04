import {Marker} from "./marker";

export interface Trail{
	trainer:    string;
	dog:        string;
	path:       Coordinates[];
	markers:    Marker[];
	isLandActivity: boolean;
	isSharedActivity: boolean;
	isTraining: boolean;
}

export interface Coordinates{
	lat: number;
	lng: number;
}
