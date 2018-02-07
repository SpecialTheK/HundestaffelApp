import {Position} from '../models/position';

export class Triangle {

    google: any;
    map: any;
    map_triangle: any;

    id: number;
    position: Position;

    usePos: any;

    constructor(google: any, map: any, id: number, position: Position) {
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = position;

        // this is only for testing
        // TODO: make this better... somehow
        this.usePos = [
            {lat: position.lat,     lng: position.lng},
            {lat: position.lat+0.002, lng: position.lng},
            {lat: position.lat, lng: position.lng+0.002}
        ];

        this.createTriangle();
    }

    createTriangle() {
        this.map_triangle = new this.google.maps.Polygon({
            paths: this.usePos,
            strokeColor: '#FF00FF',
            strokeOpacity: 0.8,
            fillColor: '#FF99FF',
            fillOpacity: 0.5
        });
        this.show();
    }

    hide() {
        this.map_triangle.setMap(null);
    }

    show() {
        this.map_triangle.setMap(this.map);
    }

    convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject()
        }
    }

}
