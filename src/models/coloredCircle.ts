/**
*
*/

export class ColoredCircle {

    google: any;
    map: any;
    circle: any;

    id: any;
    position: any;
    color: any;
    opacity: any;
    radius: any;

    constructor(google: any, map: any, id:any, position:any, color: any, opacity: any, raduis: any){
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = position;
        this.color = color;
        this.opacity = opacity;
        this.radius = raduis;

        this.circle = new google.maps.Circle({
            strokeColor: this.color,
            strokeOpacity: this.opacity,
            fillColor: this.color,
            fillOpacity: this.opacity,
            center: this.position,
            radius: this.radius
        });
        this.circle.setDraggable(true);
        this.circle.setMap(this.map);

        this.addChangeListener();
    }

    addChangeListener() {
        this.circle.addListener('click', (i) => {
            console.log("Circle " + this.id + " clicked");
        });
        this.circle.addListener('dblclick', (i) => {
            this.opacity = this.opacity - 0.1;
            this.show();
        });
    }

    hide() {
        this.circle.setOptions({
            strokeOpacity: 0,
            fillOpacity: 0
        });
    }

    show() {
        this.circle.setOptions({
            strokeOpacity: this.opacity,
            fillOpacity: this.opacity
        });
    }

}
