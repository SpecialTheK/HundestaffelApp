import {Position} from './position';

/**
 * Class defining the marker objects.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Marker {

    // List of marker symbols
    // TODO: create more symbols
    markerSymbol: any = {
        cross: [],
        attention: []
    };

    google: any;
    map: any;
    map_marker: any;

    id: number;
	
	/**
	 * Position of the marker on the map.
	 *
	 * @since 1.0.0
	 */
	position: Position;
	
	/**
	 * Title of the marker
	 *
	 * @since 1.0.0
	 */
    title: string;
	
	/**
	 * Id of the symbol of the marker
	 *
	 * @since 1.0.0
	 */
	symbolID: number;

    constructor(google: any, map: any, id: number, position: Position, title: string, symbolID: number) {
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = new Position(position.lat, position.lng);
        this.title = title;
        this.symbolID = symbolID;

        this.createMarker();
    }
	
	/**
	 * Method to create the marker in the middle of the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	createMarker() {
        this.map_marker = new this.google.maps.Marker({
            position: this.position,
            title: this.title
        });

        this.map_marker.setDraggable(false);

        this.map_marker.addListener('dblclick', (i) => {
            if(this.map_marker.getDraggable() == false){
                this.map_marker.setDraggable(true);
            }else {
                this.map_marker.setDraggable(false);
            }
        });
        this.map_marker.addListener('position_changed', (i)=>{
            //console.log(this.map_marker.getPosition().toJSON());
            this.position.lat = this.map_marker.getPosition().toJSON().lat;
            this.position.lng = this.map_marker.getPosition().toJSON().lng;
            console.log(this.position);
        })

        this.show();
    }
	
	/**
	 * Method to hide the marker.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	hide() {
        this.map_marker.setMap(null);
    }
	
	/**
	 * Method to show the marker.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	show() {
        this.map_marker.setMap(this.map);
    }
	
	/**
	 * Method to convert the marker into a normal object to save it via JSON.stringify()
	 *
	 * @returns {any}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject(),
            title: this.title,
            symbolID: this.symbolID
        };
    }
}
