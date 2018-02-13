import {Position} from './position';

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
    position: Position;
    title: string;
    symbolID: number;

    constructor(google: any, map: any, id: number, position: Position, title: string, symbolID: number) {
        this.google = google;
        this.map = map;

        this.id = id;
        this.position = position;
        this.title = title;
        this.symbolID = symbolID;

        console.log(map);

        this.createMarker();
    }

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

    convertToSimpleObject(): any {
        return {
            id: this.id,
            position: this.position.convertToSimpleObject(),
            title: this.title,
            symbolID: this.symbolID
        };
    }

}
