/*

    TODO (christian):
        - alles was die MAP tun soll, komm hier rein
            > marker setzen
            > kreise setzen
            > dreiecke setzen

        - in den MODELS wird es eine METHODE geben, die das
            jeweilige OPTIONS-Objekt erstellt und wieder gibt

*/

import { Injectable, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { Position } from '../../models/position';
import { Trail } from '../../models/trail';
import { TrailSet } from '../../models/trailSet';

declare let google: any;

/**
 * Provider that handles displaying the map.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Injectable()
export class MapProvider {

    mapObject: any;
    positionSub: any;

    trailSet: TrailSet;
    currentTrail: Trail;

    path: any;

    constructor(public location: Geolocation, public navParams: NavParams){
        //NOTE (christian): kein code hier! html seite muss erst vollständig geladen sein!
    }

    initMapObject(mapElement: ElementRef){
        this.mapObject = new google.maps.Map(mapElement.nativeElement, {
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                zoom: 16
            });
        this.location.getCurrentPosition().then((pos) => {
            this.mapObject.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
        })

        //TODO (christian): event listener für die map!
    }

    startSession(trailSet: TrailSet){
        //NOTE (christian): fromData methode garantiert, dass man ein richtiges trailset bekommt!
        this.trailSet = TrailSet.fromData(trailSet, google, this.mapObject);

        this.trailSet.getCurrentTrail().subscribe((value: Trail) => {
            this.currentTrail = value;
        });

        this.watchCurrentPosition();
    }

    endSession(){
        //TODO (christian): speicher alles was gespeichert werden muss!
        this.positionSub.unsubscribe();
    }

    watchCurrentPosition(){
        this.positionSub = this.location.watchPosition()
            //TODO (christian): finde heraus, warum filter nicht funktioniert!
            //.filter((p) => p.coords !== undefined)
            .subscribe((data) => {
                console.log(data.coords);
                this.currentTrail.addToPath(data.coords.latitude, data.coords.longitude);
            });
    }

    addMarker(markerText: string, markerSymbolID: number){
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addMarker(markerText, markerSymbolID, this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng).addToMap(google, this.mapObject);
        }
    }

    addCircle(color: string, opacity: number){
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addCircle(color, opacity, this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng).addToMap(google, this.mapObject);
        }
    }

    addTriangle(){
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addTriangle(this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng).addToMap(google, this.mapObject);
        }
    }

    drawPath(){

    }

    getLoadedTrails(){
        return new Observable<Trail[]>((observ) => {
            let allTrails = this.trailSet.trails;
            allTrails.push(this.trailSet.currentTrail);
            observ.next(allTrails);
        });
    }

}
