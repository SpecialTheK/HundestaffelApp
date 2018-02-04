/**
*
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

    marker: any = {
        id: 0,
        position: 0,
        title: ""
    }

    constructor(google: any, map: any, id: any, position: any, title: any) {
        this.google = google;
        this.map = map;

        this.marker.id = id;
        this.marker.position = position;
        this.marker.title = title;

        this.createMarker();
    }

    createMarker() {
        this.map_marker = new this.google.maps.Marker({
            position: this.marker.position,
            title: this.marker.title
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
            console.log(i);
        })

        this.show();
    }

    hide() {
        this.map_marker.setMap(null);
    }

    show() {
        this.map_marker.setMap(this.map);
    }

}
