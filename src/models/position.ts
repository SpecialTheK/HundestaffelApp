/**
 * Class defining the positions used for positioning objects in google maps.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Position {
	
	/**
	 * Latitude of the object.
	 *
	 * @since 1.0.0
	 */
    lat: number;
	
	/**
	 * Longitude of the object.
	 *
	 * @since 1.0.0
	 */
	lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }
	
	/**
	 * Method to convert a position into a normal object to save via JSON.stringify().
	 *
	 * @returns {any}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	convertToSimpleObject(): any{
        return {
            lat: this.lat,
            lng: this.lng
        };
    }

}
