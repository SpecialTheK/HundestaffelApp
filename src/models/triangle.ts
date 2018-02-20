import {Position} from './position';

/**
 * Class defining the triangle objects.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Triangle {

    id: number;
	position: Position;
    usePos: any;

    //NOTE (christian): das ist das tatsächlich angezeigte dreieck
    map_triangle: any;

    constructor(id: number, position: Position) {
        this.id = id;
        this.position = position;

        // this is only for testing
        // TODO: make this better... somehow
        this.usePos = [
            {lat: this.position.lat,        lng: this.position.lng      },
            {lat: this.position.lat-0.002,  lng: this.position.lng-0.002},
            {lat: this.position.lat-0.002,  lng: this.position.lng+0.002}
        ];
    }

	addToMap(google: any, map: any) {
        this.map_triangle = new google.maps.Polygon({
            paths: this.usePos,
            strokeColor: '#FF00FF',
            strokeOpacity: 0.8,
            fillColor: '#FF99FF',
            fillOpacity: 0.5
        });
        this.map_triangle.setEditable(false);
        this.map_triangle.setDraggable(false);
        this.map_triangle.addListener('dblclick', (i) => {
            if(this.map_triangle.getEditable() == false){
                this.map_triangle.setEditable(true);
                this.map_triangle.setDraggable(true);
            }else {
                this.map_triangle.setEditable(false);
                this.map_triangle.setDraggable(false);
            }
        });

        this.map_triangle.setMap(map);
    }

	toggle(map: any = null) {
        this.map_triangle.setMap(map);
    }

	convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject()
        }
    }

}
