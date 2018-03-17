import {Position} from './position';

//TODO (christian): mach die bitte schöner!
const symbol_url: string[] = [
    "assets/imgs/mapIcons/Ausgeschlossen_BLACK_32.png",
    "assets/imgs/mapIcons/Interesse_NORMAL_32.png"
];

/**
 * Class defining the marker objects.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Marker {

    /**
	 * ID of the Marker.
	 *
	 * @since 1.0.0
	 */
    id: number;

    /**
	 * Position of the Marker.
	 *
	 * @since 1.0.0
	 */
    position: Position;

    /**
     * symbolID of the Marker.
     *
     * @since 1.0.0
     */
    symbolID: number;

    /**
     * Orientation of the Marker (only wind direction).
     *
     * @since 1.0.0
     */
    orientation: number = 0;

    //NOTE (christian): das ist der tatsächlich angezeigte marker!
    map_marker: any;

    constructor(id: number, position: Position, symbolID: number, orientation?: number){
        this.id = id;
        this.position = position;
        this.symbolID = symbolID;
        this.orientation = orientation;
    }

    /**
     * Method to display the Marker on the map.
     *
     * @param google
     * @param map
     * @since 1.0.0
     * @version 1.0.0
     */
    addToMap(google: any, map: any){
        if(this.symbolID !== -1){
            this.map_marker = new google.maps.Marker({
                position: this.position.convertToSimpleObject(),
                icon: {url: symbol_url[this.symbolID], anchor: new google.maps.Point(16, 16)},
            });
        }else {
            this.map_marker = new google.maps.Marker({
                position: this.position.convertToSimpleObject(),
                icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, rotation: this.orientation, scale: 4},
            });
        }
        this.map_marker.setDraggable(false);
        this.map_marker.addListener('dblclick', (f) => {
            if(this.map_marker.getDraggable() == false){
                this.map_marker.setDraggable(true);
            }else {
                this.map_marker.setDraggable(false);
            }
        });
        this.map_marker.addListener('position_changed', (i)=>{
            this.position.lat = this.map_marker.getPosition().toJSON().lat;
            this.position.lng = this.map_marker.getPosition().toJSON().lng;
        });

        this.map_marker.setMap(map);
    }

    /**
     * Method to change the orientation of the Marker.
     *
     * @param orientation
     * @since 1.0.0
     * @version 1.0.0
     */
    changeOrientation(orientation: number) {
        this.map_marker.setIcon({path: 1, rotation: orientation, scale: 4});
        this.orientation = orientation;
    }

    /**
     * Method to toggle the Marker on the map.
     *
     * @param map
     * @since 1.0.0
     * @version 1.0.0
     */
    toggle(map: any = null){
        this.map_marker.setMap(map);
    }

    /**
	 * Convert this Marker into a simple object without any methods in order to store it via JSON.stringify()
	 *
	 * @returns {Object}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    convertToSimpleObject(): any{
        return {
            id: this.id,
            position: this.position.convertToSimpleObject(),
            symbolID: this.symbolID,
            orientation: this.orientation
        };
    }
}
