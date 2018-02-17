import {Position} from './position';

/**
 * Class defining the circle objects
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class ColoredCircle {

    google: any;
    map: any;
    map_circle: any;
    id: number;
	
	/**
     * Position of the circle on the map.
     *
     * @since 1.0.0
	 */
	position: Position;
	
	/**
     * Color of the circle.
     *
     * @since 1.0.0
	 */
	color: string;
	
	/**
     * Opacity of the circle.
     *
     * @since 1.0.0
	 */
	opacity: number;
	
	/**
     * Radius of the circle.
     *
     * @since 1.0.0
	 */
	radius: number;

    constructor(google: any, map: any, id: number, position: Position, color: string, opacity: number){
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = new Position(position.lat, position.lng);
        this.color = color;
        this.opacity = opacity;
        this.radius = 100;

        this.createCircle();
    }
	
	/**
     * Method to create a new cicle in the center of the map.
     *
     * @since 1.0.0
	 * @version 1.0.0
	 */
	createCircle() {
        this.map_circle = new this.google.maps.Circle({
            strokeColor: this.color,
            strokeOpacity: this.opacity,
            fillColor: this.color,
            fillOpacity: this.opacity,
            center: this.position.convertToSimpleObject(),
            radius: this.radius
        });
        this.map_circle.setEditable(false);
        this.map_circle.setDraggable(false);

        this.map_circle.addListener('dblclick', (i) => {
            if(this.map_circle.getEditable() == false){
                this.map_circle.setEditable(true);
                this.map_circle.setDraggable(true);
            }else {
                this.map_circle.setEditable(false);
                this.map_circle.setDraggable(false);
            }
        });

        this.map_circle.addListener('center_changed', (i)=>{
            console.log(this.map_circle.getCenter().toJSON());
            this.position.lat = this.map_circle.getCenter().toJSON().lat;
            this.position.lng = this.map_circle.getCenter().toJSON().lng;
        });
        this.map_circle.addListener('radius_changed', (i)=>{
            console.log(this.map_circle.getRadius());
            this.radius = this.map_circle.getRadius();
        });

        this.show();
    }
	
	/**
     * Method to hide the circle.
     *
     * @since 1.0.0
	 * @version 1.0.0
	 */
	hide() {
        this.map_circle.setMap(null);
    }
	
	/**
     * Method to show the circle.
     *
     * @since 1.0.0
	 * @version 1.0.0
	 */
	show() {
        this.map_circle.setMap(this.map);
    }
	
	/**
     * Method to concert the circle into a normal object without methods to save it via JSON.stringify();
     *
	 * @returns {any}
     * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject(),
            color: this.color,
            opacity: this.opacity,
            radius: this.radius
        };
    }

}
