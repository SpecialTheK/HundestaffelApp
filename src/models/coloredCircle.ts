import {Position} from './position';

export class ColoredCircle {

    google: any;
    map: any;
    map_circle: any;

    id: number;
    position: Position;
    color: string;
    opacity: number;
    radius: number;

    constructor(google: any, map: any, id: number, position: Position, color: string, opacity: number){
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = position;
        this.color = color;
        this.opacity = opacity;
        this.radius = 100;

        this.createCircle();
    }

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
        //TODO: add a change listener
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

    hide() {
        this.map_circle.setMap(null);
    }

    show() {
        this.map_circle.setMap(this.map);
    }

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
