/**
*
*/

export class Triangle {

    google: any;
    map: any;
    map_triangle: any;

    triangle: any = {
        id: 0,
        positions: 0,
    }

    constructor(google: any, map: any, id: any, position: any) {
        this.google = google;
        this.map = map;

        this.triangle.id = id;
        this.triangle.position = [
            {lat: position.lat,     lng: position.lng},
            {lat: position.lat+0.002, lng: position.lng},
            {lat: position.lat, lng: position.lng+0.002}
        ];

        this.createTriangle();
    }

    createTriangle() {
        this.map_triangle = new this.google.maps.Polygon({
            paths: this.triangle.position,
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

}
