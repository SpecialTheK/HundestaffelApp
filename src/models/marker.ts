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

    id: number;
    position: Position;
    title: string;
    symbolID: number;

    //NOTE (christian): das ist der tatsächlich angezeigte marker!
    map_marker: any;

    constructor(id: number, position: Position, title: string, symbolID: number){
        this.id = id;
        this.position = position;
        this.title = title;
        this.symbolID = symbolID;
    }

    addToMap(google: any, map: any){
        this.map_marker = new google.maps.Marker({
            position: this.position.convertToSimpleObject(),
            icon: {url: symbol_url[this.symbolID], anchor: new google.maps.Point(16, 16)},
            title: this.title
        });
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

    toggle(map: any = null){
        this.map_marker.setMap(map);
    }

    highlight(){
        //TODO (christian): highlight den marker
    }

    convertToSimpleObject(): any{
        return {
            id: this.id,
            position: this.position.convertToSimpleObject(),
            title: this.title,
            symbolID: this.symbolID
        };
    }
}
