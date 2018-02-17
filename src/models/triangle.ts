import {Position} from './position';

/**
 * Class defining the triangle objects.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Triangle {

    google: any;
    map: any;
    map_triangle: any;

    id: number;
	
	/**
	 * Position of the triangle.
	 *
	 * @since 1.0.0
	 */
	position: Position;

    usePos: any;

    constructor(google: any, map: any, id: number, position: Position) {
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = new Position(position.lat, position.lng);

        // this is only for testing
        // TODO: make this better... somehow
        this.usePos = [
            {lat: this.position.lat,        lng: this.position.lng      },
            {lat: this.position.lat-0.002,  lng: this.position.lng-0.002},
            {lat: this.position.lat-0.002,  lng: this.position.lng+0.002}
        ];

        this.createTriangle();
    }
	
	/**
	 * Method to create a new triangle in the center of the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	createTriangle() {
        this.map_triangle = new this.google.maps.Polygon({
            paths: this.usePos,
            strokeColor: '#FF00FF',
            strokeOpacity: 0.8,
            fillColor: '#FF99FF',
            fillOpacity: 0.5
        });

        this.map_triangle.addListener('dblclick', (i) => {
            if(this.map_triangle.getEditable() == false){
                this.map_triangle.setEditable(true);
                this.map_triangle.setDraggable(true);
            }else {
                this.map_triangle.setEditable(false);
                this.map_triangle.setDraggable(false);
            }
        });

        this.show();
    }
	
	/**
	 * Method to hide this triangle.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	hide() {
        this.map_triangle.setMap(null);
    }
	
	/**
	 * Method to show this triangle.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	show() {
        this.map_triangle.setMap(this.map);
    }
	
	/**
	 * Method to convert the triangle into a normal object in order to save it via JSON.stringify().
	 *
	 * @returns {any}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject()
        }
    }

}
