import {Injectable} from '@angular/core';
import {Trail} from "../../models/trail";
import {Observable} from "rxjs/Observable";
import {TrailSet} from "../../models/trailSet";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {Storage} from "@ionic/storage";
import {Platform} from "ionic-angular";

enum ObjectType{
	CIRCLE = 0,
	MARKER = 1,
	TRIANGLE = 2,
}

/**
 * Provider to interact with the database in order to save new trails, add them to a trailSet, display trailSets or delete a trailSet.
 */
@Injectable()
export class TrailStorageProvider {
	//TODO: Fehler behandeln (schon inserteten stuff deleten)
	public database;
	
	constructor(public storage: Storage, public platform: Platform, public sqlite: SQLite) {
		this.initDatabase(sqlite);
	}

	/**
	 * Add a new trailSet with the passed trailSet.
	 *
	 * @param {Trail} trailSet The trailSet to push to the new trailSet.
	 *
	 * @returns {Promise<string>} Resolves on success, rejects when that trailSet is already existing or
	 * the trailSet couldn't be saved to storage.
	 * @since 1.0.0
	 * @version 1.0.1
	 *
	 * @deprecated Use addSearch() instead.
	 */
	public addNewTrailSet(trailSet: TrailSet):Promise<string>{
		return this.addSearch(trailSet);
	}
	
	/**
	 * Insert a new search into the database using the given trailSet.
	 *
	 * @param {Trail} trailSet The trailSet to insert into the database.
	 *
	 * @returns {Promise<string>} Resolves on success, rejects when the trailSet couldn't be saved in the database.
	 * @since 1.0.1
	 * @version 1.0.0
	 */
	public addSearch(trailSet: TrailSet):Promise<string>{
		return new Promise((resolve, reject) => {
			this.database.executeSql("INSERT INTO search VALUES ("+trailSet.creationID+", '"+trailSet.isLandTrail+"', "+trailSet.trails[0].startTime.getTime()+", '"+trailSet.isTraining+"', '"+trailSet.isSharedTrail+"', '"+trailSet.preSituation+"', '"+trailSet.situation+"', "+trailSet.temperature+", '"+trailSet.precipitation+"', '"+trailSet.risks+"', '"+trailSet.person.name+"');", {}).then(() => {
				for(let trail of trailSet.trails){
					this.addTrailToSearch(trailSet.creationID, trail, false);
				}
				
				this.database.executeSql("INSERT INTO persons VALUES ('"+trailSet.person.name+"', "+trailSet.person.age+", '"+trailSet.person.glasses+"', '"+trailSet.person.hair_choice+"', '"+trailSet.person.hairColor_choice+"', '"+trailSet.person.body_choice+"', '"+trailSet.person.allergies+"', '"+trailSet.person.illness+"','"+trailSet.person.medication+"','"+trailSet.person.image+"');", {}).then(() => {
					console.log("Person inserted");
				}).catch((error) => {
					console.log("Error while inserting marker object: "+JSON.stringify(error));
				});
				this.databaseInfo();
				resolve("All working");
			}).catch((error) => {
				console.log("Error while inserting data into search table: "+JSON.stringify(error));
				reject("stuff");
			});
		});
	}
	
	/**
	 * Adds a trail to an existing trailSet.
	 *
	 * @param {string} key The key identifying the trailSet to be updated.
	 * @param {Trail} trail The trail to add.
	 * @param sharedActivity
	 *
	 * @returns {Promise<string>} Resolves when the trailSet was updated. Rejects when there was an error saving the trailSet or the trailSet couldn't be found.
	 * @since 1.0.0
	 * @version 1.0.1
	 *
	 * @deprecated Use addTrailToSearch instead.
	 */
	
	public addTrailToSet(key: number, trail:Trail, sharedActivity: boolean = false):Promise<string>{
		return this.addTrailToSearch(key, trail, sharedActivity);
	}
	
	/**
	 * Adds a trail to an existing search
	 *
	 * @param {number} search_id The number identifying the search to be updated
	 * @param {Trail} trail The trail to insert into the database
	 * @param {boolean} sharedActivity Whether to update the sharedActivity status to shared or not.
	 *
	 * @returns {Promise<string>} Resolves when the trail was updated, else rejects with the error message.
	 * @since 1.0.1
	 * @version 1.0.0
	 */
	public addTrailToSearch(search_id: number, trail: Trail, sharedActivity: boolean = false):Promise<string>{
		return new Promise((resolve, reject) => {
			if(sharedActivity){
				let search_statement = "UPDATE `search` SET is_shared = true WHERE search_id = '"+search_id+"'";
				this.database.executeSql(search_statement, {}).then((answer) => {
					console.log("Search now marked as shared");
				}).catch((error) => {
					console.log("Shared not updated: "+JSON.stringify(error));
				});
			}
			
			this.database.executeSql("INSERT INTO trails VALUES ("+trail.id+", "+search_id+", '"+trail.trainer+"', "+trail.startTime.getTime()+", "+trail.endTime.getTime()+", "+trail.distance+");", {}).then(() => {
				for(let position of trail.path){
					this.database.executeSql("INSERT INTO positions VALUES ("+search_id+", "+trail.id+", "+position.lng+", "+position.lat+");", {}).catch((error) => {
						console.log("Position for trail "+trail.id+" not inserted: "+JSON.stringify(error));
					});
				}
				
				for(let circle of trail.circles){
					this.database.executeSql("INSERT INTO map_objects (search_id, trail_id, object_id, object_type, color, opacity, radius, pos_x1, pos_y1) VALUES ("+search_id+", "+trail.id+", "+circle.id+", "+ObjectType.CIRCLE+", '"+circle.color+"', "+circle.opacity+", "+circle.radius+", "+circle.position.lng+", "+circle.position.lat+");", {}).catch((error) => {
						console.log("Error while inserting circle object: "+JSON.stringify(error));
					});
				}
				
				for(let triangle of trail.triangles){
					this.database.executeSql("INSERT INTO map_objects (search_id, trail_id, object_id, object_type, pos_x1, pos_y1, pos_x2, pos_y2, pos_x3, pos_y3) VALUES ("+search_id+", "+trail.id+", "+triangle.id+", "+ObjectType.TRIANGLE+", "+triangle.usePos[0].lng+", "+triangle.usePos[0].lat+", "+triangle.usePos[1].lng+", "+triangle.usePos[1].lat+", "+triangle.usePos[2].lng+", "+triangle.usePos[2].lat+");", {}).catch((error) => {
						console.log("Error while inserting triangle object: "+JSON.stringify(error));
					});
				}
				
				for(let marker of trail.marker){
					this.database.executeSql("INSERT INTO map_objects (search_id, trail_id, object_id, object_type, symbol_id, orientation, pos_x1, pos_y1) VALUES ("+search_id+", "+trail.id+", "+marker.id+", "+ObjectType.MARKER+", "+marker.symbolID+", "+marker.orientation+", "+marker.position.lng+", "+marker.position.lat+");", {}).catch((error) => {
						console.log("Error while inserting marker object: "+JSON.stringify(error));
					});
				}
				this.databaseInfo();
				resolve("Trail inserted");
			}).catch((error) => {
				reject("Failed to insert trail with id "+trail.id+": "+JSON.stringify(error));
			});
		});
	}
	
	

	/**
	 * Remove a trailSet from the storage.
	 *
	 * @param {string} key The key of the trailSet to be removed.
	 *
	 * @returns {Promise<string>} Resolves when the trailSet was removed,
	 * rejects when it couldn't be found or couldn't be removed.
	 * @since 1.0.0
	 * @version 1.0.1
	 *
	 * @deprecated Use deleteSearch() instead.
	 */
	public removeTrailSet(key: number):Promise<string>{
		return this.deleteSearch(key);
	}
	
	/**
	 * Method to remove a search and all its contents from the database,
	 *
	 * @param {number} search_id The id of the search to remove
	 *
	 * @returns {Promise<string>} Resolves when the search was deleted, else rejects with the error message.
	 * @since 1.0.1
	 * @version 1.0.0
	 */
	public deleteSearch(search_id: number):Promise<string>{
		return new Promise((resolve, reject) => {
			this.database.executeSql("DELETE FROM search WHERE search_id = "+search_id+";", {})
				.then( () => {
					resolve("Search deleted");
					this.databaseInfo();
				})
				.catch((error) => reject("Search not deleted: "+JSON.stringify(error)));
		});
	}

	/**
	 * Get a single trailSet from the storage.
	 *
	 * @param {string} key The key of the trailSet to be retrieved.
	 *
	 * @returns {Promise<string>} Resolves with the trailSet as answer if it could be retrieved,
	 * rejects when the trailSet couldn't be found.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	
	public getTrailSet(key: string):Promise<TrailSet>{
		return new Promise<TrailSet>((resolve, reject) => {
			this.storage.ready().then((answer) => {
				this.storage.get(key).then((answer) => {
					if(answer === null){
						reject("trailSet not found");
					}
					resolve(TrailSet.fromData(JSON.parse(answer)));
				}).catch((error) => {
					reject("Couldn't get trailSet: "+JSON.stringify(error));
				});
			}).catch((error) => {
				reject("Internal storage error: "+JSON.stringify(error));
			});
		});
	}

	/**
	 * Get the last x trailSets from the storage. Not optimized for big amounts.
	 *
	 * @param {number} amount The amount of trailSets to fetch.
	 * @param {number} search_id ID of the last queued search.
	 *
	 * @returns {Observable<Trail[]>} Returns one trailSet in each push. Throws an error if data couldn't be retrieved.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	
	public getLatestTrailSets(amount:number = 0, search_id:number = 0):Observable<TrailSet>{
		return new Observable<TrailSet>((observer) => {
			this.storage.ready().then((answer) => {
				this.storage.keys().then((keys) => {
					let reversedKeys = keys.reverse();
					if(amount > reversedKeys.length || amount == 0){
						amount = reversedKeys.length;
					}
					for(let i = 0; i < amount; i++){
						this.getTrailSet(reversedKeys[i]).then((answer) => {
							observer.next(answer);
							if(i == amount-1){ // Doesn't work outside of for loop
								observer.complete();
							}
						}).catch((error) => {
							observer.error("Couldn't fetch trailSet: "+JSON.stringify(error));
						});
					}
				}).catch((error) => {
					observer.error("Couldn't fetch keys: "+JSON.stringify(error));
				});
			});
		});
	}
	
	/**
	 * Open the database and create all tables if they don't exist.
	 *
	 * @param {SQLite} sqlite
	 *
	 * @since 1.0.1
	 * @version 1.0.0
	 */
	private initDatabase(sqlite: SQLite){
		sqlite.create({name: 'trailStorage.db', location: 'default'}).then((database: SQLiteObject) => {
			this.database = database;
			
			// Foreign key support
			this.database.executeSql("PRAGMA foreign_keys = ON;", {}).then(() => {
				console.log("Foreign key support activated.");
			}).catch((error) => {
				console.log("Foreign key support not activated: "+JSON.stringify(error));
			});
			
			// Search table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `search` ( search_id NUMERIC, search_type TEXT, search_date NUMERIC, is_training TEXT, is_shared TEXT, pre_situation TEXT, situation TEXT, temperature REAL, precipitation TEXT, risks TEXT, person_name TEXT, PRIMARY KEY (search_id) );", {}).then(() => {
				console.log("Search table inserted");
			}).catch((error) => {
				console.log("Search table not inserted: "+JSON.stringify(error));
			});
			
			// Trails table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `trails` ( trail_id INTEGER, search_id NUMERIC, trainer TEXT, start_time NUMERIC, end_time NUMERIC, distance REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, PRIMARY KEY (search_id, trail_id) );", {}).then(() => {
				console.log("Trails table inserted");
			}).catch((error) => {
				console.log("Trails table not inserted: "+JSON.stringify(error));
			});
			
			// Positions table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `positions` ( search_id NUMERIC, trail_id INTEGER, pos_x REAL, pos_y REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, FOREIGN KEY (trail_id) REFERENCES trails (trail_id) ON DELETE CASCADE );", {}).then(() => {
				console.log("Positions table inserted");
			}).catch((error) => {
				console.log("Positions table not inserted: "+JSON.stringify(error));
			});
			
			// Map objects table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `map_objects` ( search_id NUMERIC, trail_id INTEGER, object_id INTEGER, object_type INTEGER, color TEXT, opacity REAL, radius REAL, orientation REAL, symbol_id INTEGER, pos_x1 REAL, pos_y1 REAL, pos_x2 REAL, pos_y2 REAL, pos_x3 REAL, pos_y3 REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, FOREIGN KEY (trail_id) REFERENCES trails (trail_id) ON DELETE CASCADE, PRIMARY KEY (search_id, trail_id, object_id) );", {}).then(() => {
				console.log("Map objects table inserted");
			}).catch((error) => {
				console.log("Map objects table not inserted: "+JSON.stringify(error));
			});
			
			// Persons table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `persons` ( name TEXT, age INTEGER, glasses TEXT, hair_style TEXT, hair_color TEXT, body_type TEXT, allergies TEXT, illness TEXT, medication TEXT, image TEXT );", {}).then(() => {
				console.log("Persons table inserted");
			}).catch((error) => {
				console.log("Persons table not inserted: "+JSON.stringify(error));
			});
			
			this.databaseInfo();
		}).catch((error) => {
			console.log('Database not opened: '+JSON.stringify(error));
		});
	}
	
	private databaseInfo(){
		this.database.executeSql("SELECT COUNT(*) FROM search", {}).then((data) => {
			console.log("Search table info: "+JSON.stringify(data));
		});
		this.database.executeSql("SELECT COUNT(*) FROM trails", {}).then((data) => {
			console.log("Trails table info: "+JSON.stringify(data));
		});
		this.database.executeSql("SELECT COUNT(*) FROM persons", {}).then((data) => {
			console.log("Persons table info: "+JSON.stringify(data));
		});
		this.database.executeSql("SELECT COUNT(*) FROM map_objects", {}).then((data) => {
			console.log("Map objects table info: "+JSON.stringify(data));
		});
		this.database.executeSql("SELECT COUNT(*) FROM positions", {}).then((data) => {
			console.log("Positions table info: "+JSON.stringify(data));
		});
	}
	
	//TODO Debug -> Entfernen!!!!!
	public deleteDatabase(){
		this.databaseInfo();
		this.sqlite.deleteDatabase({name: 'trailStorage.db', location: 'default'}).then( (answer) => {
			console.log("Database deleted: "+answer);
		}).catch((error) => {
			console.log("Database not deleted: "+JSON.stringify(error));
		})
	}
}
