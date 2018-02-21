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
import { TrailStorageProvider } from '../trail-storage/trail-storage';
import {Observable} from "rxjs";

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

    //DEBUG (christian): neuer trail zum vergleichen!
    testCircle: any;

    constructor(public location: Geolocation, public navParams: NavParams){
        //NOTE (christian): kein code hier! html seite muss erst vollständig geladen sein!
    }

    initMapObject(mapElement: ElementRef){
        this.mapObject = new google.maps.Map(mapElement.nativeElement, {
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: true,
                zoom: 16
            });
        this.location.getCurrentPosition().then((pos) => {
            this.mapObject.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
        })

        //TODO (christian): event listener für die map!

        //DEBUG (christian): wir test jetzt was!
        this.mapObject.addListener('click', (i) => {
            console.log(i.latLng.toJSON());

            this.testCircle = new google.maps.Circle({
                strokeColor: "#ff0000",
                strokeOpacity: 0.6,
                fillColor: "#ff0000",
                fillOpacity: 0.6,
                center: {lat: i.latLng.toJSON().lat, lng: i.latLng.toJSON().lng,},
                radius: 50
            });
            this.testCircle.setMap(this.mapObject);

            if(google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng),
                new google.maps.LatLng(i.latLng.toJSON().lat, i.latLng.toJSON().lng)
            ) <= 50 ){
                console.log("Ist drin!");
            }else {
                console.log("Ist nicht drin!")
            }

        });

    }

    startSession(trailSet: TrailSet){
        //NOTE (christian): fromData methode garantiert, dass man ein richtiges trailset bekommt!
        this.trailSet = TrailSet.fromData(trailSet, google, this.mapObject);
        this.trailSet.getCurrentTrail().subscribe((value: Trail) => {
            this.currentTrail = value;
        });
        this.path = new google.maps.Polyline({
            strokeColor: "#ff0000",
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        this.path.setMap(this.mapObject);

        this.watchCurrentPosition();
    }

    endSession(){
        //TODO (christian): speicher alles was gespeichert werden muss!
        this.positionSub.unsubscribe();
    }

    watchCurrentPosition(){
        let recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                this.currentTrail.addToPath(pos.coords.latitude, pos.coords.longitude);
                this.drawPath(pos.coords.latitude, pos.coords.longitude);
                console.log(pos);
            })
        }, 2000);
        /*
        this.positionSub = this.location.watchPosition()
            //TODO (christian): finde heraus, warum filter nicht funktioniert!
            //.filter((p) => p.coords !== undefined)
            .subscribe((data) => {
                console.log(data.coords);
                this.currentTrail.addToPath(data.coords.latitude, data.coords.longitude);
                this.mapObject.panTo(data.coords.latitude, data.coords.longitude);
            });
        */
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

    drawPath(lat: number, lng: number){
        let p = this.path.getPath();
        p.push(new google.maps.LatLng(lat, lng));
    }

    getLoadedTrails(){
        return new Observable<Trail[]>((observ) => {
            let allTrails = this.trailSet.trails;
            // TODO: Fix
            /*allTrails.push(this.trailSet.currentTrail);
            observ.next(allTrails);*/
        });
    }

}
