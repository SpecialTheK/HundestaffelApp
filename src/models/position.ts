export class Position {

    lat: number;
    lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    convertToSimpleObject(): any{
        console.log("Test LUL");
        return {
            lat: this.lat,
            lng: this.lng
        };
    }

}
