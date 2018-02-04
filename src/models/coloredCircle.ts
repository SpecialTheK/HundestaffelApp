/**
*
*/

export class ColoredCircle {

    google: any;
    map: any;
    map_circle: any;

    circle: any = {
        id: 0,
        position: 0,
        color: 0,
        opacity: 0,
        radius: 0
    }

    //currentMode: any;

    constructor(google: any, map: any, id:any, position:any, color: any, opacity: any, radius: any){
        this.google = google;
        this.map = map;

        this.circle.id = id;
        this.circle.position = position;
        this.circle.color = color;
        this.circle.opacity = opacity;
        this.circle.radius = radius;

        this.createCircle();
    }

    createCircle() {
        this.map_circle = new this.google.maps.Circle({
            strokeColor: this.circle.color,
            strokeOpacity: this.circle.opacity,
            fillColor: this.circle.color,
            fillOpacity: this.circle.opacity,
            center: this.circle.position,
            radius: this.circle.radius
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
            console.log(i);
        });
        this.map_circle.addListener('radius_changed', (i)=>{
            console.log(i);
        });

        this.show();
    }

    hide() {
        this.map_circle.setMap(null);
    }

    show() {
        this.map_circle.setMap(this.map);
    }

}
