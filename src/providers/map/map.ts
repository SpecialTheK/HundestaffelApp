import { Injectable, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TrailStorageProvider } from '../trail-storage/trail-storage';
import {Observable, Subject} from "rxjs";
import {Vibration} from '@ionic-native/vibration';
import {DeviceOrientation, DeviceOrientationCompassHeading} from '@ionic-native/device-orientation';

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
    headingSub: any;
    headingMap: DeviceOrientationCompassHeading;

    isCentered: boolean;

    currentTrailNumber = 0;

    currentTrail: Trail;
    comparisonTrail: Trail;
    waterDogTrail: Trail;

    currentTrailSubject: Subject<Trail>;

    distanceToTargetMarker: Subject<number>;

    virtualTrainerIsActive = false;

    polyline: any;

    isLandTrail: boolean;

    constructor(public location: Geolocation, public navParams: NavParams, public vibration: Vibration, public deviceOrientation: DeviceOrientation){
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

        this.mapObject.addListener('drag', (f) => {
            this.isCentered = false;
        });

    }

    importTrailSet(trailSet: TrailSet){
        TrailSet.fromData(trailSet, google, this.mapObject);
    }

    startSession(isLandTrail: boolean){
        this.isLandTrail = isLandTrail;
        this.distanceToTargetMarker = new Subject<number>();
        this.currentTrailSubject = new Subject<Trail>();
        this.currentTrail = new Trail(0, "Trainer", "Hund");
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
        //this.positionSub.unsubscribe();
    }

    watchCurrentPosition(){
        //NOTE (christian): nur für testing sonst watchPosition benutzen!
        this.headingSub = this.deviceOrientation.watchHeading().subscribe(
            (data: DeviceOrientationCompassHeading) => {this.headingMap = data;},
            (error: any) => {
                console.log(error);
                this.headingMap = null;
            }
        );

        let recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                console.log(pos);
                this.currentTrail.addToPath(pos.coords.latitude, pos.coords.longitude);
                this.drawPath(pos.coords.latitude, pos.coords.longitude);

                this.currentTrail.distance = google.maps.geometry.spherical.computeLength(this.polyline.getPath());

                if(pos.coords.speed !== null){
                    this.currentTrail.speed = pos.coords.speed;
                }
                if(this.headingMap !== null){
                    this.mapObject.setHeading(this.headingMap.magneticHeading);
                }
                if(this.isCentered){
                    this.mapObject.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
                }

                if(this.isLandTrail){
                    this.checkVirtualTrainer(pos.coords.latitude, pos.coords.longitude);
                } else {
                    this.cumputeDistanceToTargetMarker(pos.coords.latitude, pos.coords.longitude);
                }

                this.currentTrailSubject.next(this.currentTrail);
            })
        }, 2000);
        /*
        this.positionSub = this.location.watchPosition()
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

    cumputeDistanceToTargetMarker(lat: number, lng: number){
        if(this.currentTrail.marker.length > 0){
            let marker = this.currentTrail.marker[this.currentTrail.marker.length - 1].map_marker;
            let dis = google.maps.geometry.spherical.computeDistanceBetween(
                marker.getPosition(),
                new google.maps.LatLng(lat, lng)
            );
            this.distanceToTargetMarker.next(dis);
        }
    }

    checkVirtualTrainer(lat: number, lng: number){
        if(this.virtualTrainerIsActive === true){
            if(google.maps.geometry.poly.isLocationOnEdge(
                new google.maps.LatLng(lat, lng),
                this.comparisonTrail.polyline,
                10e-5
            )){
                console.log("JA");
            }else {
                this.vibration.vibrate(1000);
                console.log("NEIN");
            }
        }
    }

    toggleVirtualTrainer(comparison: Trail){
        if(this.virtualTrainerIsActive){
            this.virtualTrainerIsActive = false;
        } else {
            this.virtualTrainerIsActive = true;
            this.comparisonTrail = Trail.fromData(comparison, google, this.mapObject);
        }
    }

    centerMap(){
        this.mapObject.panTo(this.currentTrail.getLastPosition().convertToSimpleObject());
        this.isCentered = true;
    }

    addMarker(markerText: string, markerSymbolID: number, orientation?: number){
        if(!this.isLandTrail && this.currentTrail.marker.length > 0){
            this.currentTrail.marker[this.currentTrail.marker.length - 1].toggle(null);
        }
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addMarker(markerText, markerSymbolID, this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng, orientation).addToMap(google, this.mapObject);
            this.currentTrailSubject.next(this.currentTrail);
        }
    }

    addCircle(opacity: number){
        if(this.currentTrail.path.length >= 1){
            if(this.waterDogTrail !== null){
                this.waterDogTrail.addCircle(opacity, this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng).addToMap(google, this.mapObject);
            }
        }
    }

    addTriangle(){
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addTriangle(this.currentTrail.getLastPosition().lat, this.currentTrail.getLastPosition().lng).addToMap(google, this.mapObject);
            this.currentTrailSubject.next(this.currentTrail);
        }
    }

    drawPath(lat: number, lng: number){
        let p = this.polyline.getPath();
        p.push(new google.maps.LatLng(lat, lng));
    }

    getCurrentTrailSubject(): Subject<Trail>{
        return this.currentTrailSubject;
    }

    getDistanceToTargetMarker(): Subject<number>{
        return this.distanceToTargetMarker;
    }

    setWaterDogTrail(trail: Trail){
        this.waterDogTrail = trail;
    }

    toggleWaterDogTrail(hide: boolean){
        if(hide){
            this.waterDogTrail.hide();
        }else {
            this.waterDogTrail.show(this.mapObject);
        }
    }

}
