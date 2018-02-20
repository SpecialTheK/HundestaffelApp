import {Position} from './position';

/**
 * Class defining the marker objects.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export class Marker {

    //TODO (christian): baue alle marker symbole!

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
        })

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
