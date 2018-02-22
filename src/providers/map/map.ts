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

    isCentered: boolean;

    currentTrail: Trail;
    currentTrailNumber = 0;

    polyline: any;

    currentSpeed = 0;
    currentDirection = 0;

    //DEBUG (christian): neuer trail zum vergleichen!
    testCircle: any;
    testString = "Hallo";

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
            this.isCentered = true;
        });

        //TODO (christian): event listener für die map!
        this.mapObject.addListener('drag', (f) => {
            this.isCentered = false;
        });

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

    importTrailSet(trailSet: TrailSet){
        this.currentTrailNumber = TrailSet.fromData(trailSet, google, this.mapObject).trails.length;
    }

    startSession(){
        //NOTE (christian): fromData methode garantiert, dass man ein richtiges trailset bekommt!
        this.currentTrail = new Trail(this.currentTrailNumber, "Trainer", "Hund");
        this.currentTrail.setStartTime();

        this.polyline = new google.maps.Polyline({
            strokeColor: this.currentTrail.trailColor,
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        this.polyline.setMap(this.mapObject);

        this.watchCurrentPosition();
    }

    endSession(){
        //TODO (christian): speicher alles was gespeichert werden muss!
        //this.positionSub.unsubscribe();
    }

    watchCurrentPosition(){
        //NOTE (christian): nur für testing sonst watchPosition benutzen!
        let recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                console.log(pos);
                this.currentTrail.addToPath(pos.coords.latitude, pos.coords.longitude);
                this.drawPath(pos.coords.latitude, pos.coords.longitude);

                if(pos.coords.speed !== null){
                    this.currentSpeed = pos.coords.speed;
                }

                if(pos.coords.heading !== null){
                    this.currentDirection = pos.coords.heading;
                    this.mapObject.setHeading(pos.coords.heading);
                }

                if(this.isCentered){
                    this.mapObject.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
                }
            })
        }, 2000);
        /*
        this.positionSub = this.location.watchPosition()
            //TODO (christian): finde heraus, warum filter nicht funktioniert!
            //.filter((p) => p.coords !== undefined)
            .subscribe((data) => {
                console.log(pos);
                this.currentTrail.addToPath(pos.coords.latitude, pos.coords.longitude);
                this.drawPath(pos.coords.latitude, pos.coords.longitude);

                if(pos.coords.speed !== null){
                    this.currentSpeed = pos.coords.speed;
                }

                if(pos.coords.heading !== null){
                    this.currentDirection = pos.coords.heading;
                    this.mapObject.setHeading(pos.coords.heading);
                }

                if(this.isCentered){
                    this.mapObject.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
                }
            });
        */
    }

    centerMap(){
        this.mapObject.panTo(this.currentTrail.getLastPosition().convertToSimpleObject());
        this.isCentered = true;
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
        let p = this.polyline.getPath();
        p.push(new google.maps.LatLng(lat, lng));
    }

}
