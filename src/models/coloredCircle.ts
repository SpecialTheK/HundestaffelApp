import {Position} from './position';

/**
 * Class defining the circle objects
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class ColoredCircle {

    id: number;
    position: Position;
    color: string;
    opacity: number;
    radius: number;

    //NOTE (christian): das ist der tatsächlich angezeigte kreis!
    map_circle: any;

    constructor(id: number, position: Position, color: string, opacity: number){
        this.id = id;
        this.position = new Position(position.lat, position.lng);
        this.color = color;
        this.opacity = opacity;
        this.radius = 50;
    }

    addToMap(google: any, map: any){
        this.map_circle = new google.maps.Circle({
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

        this.map_circle.setMap(map);
    }

    toggle(map: any = null){
        this.map_circle.setMap(map);
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
