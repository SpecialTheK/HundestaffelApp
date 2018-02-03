export interface Trail{
	trainer:    string;
	dog:        string;
	path:       Coordinates[];
	markers:    Marker[]
}

export interface Coordinates{
	lat: number;
	lng: number;
}

export interface Marker{

}
