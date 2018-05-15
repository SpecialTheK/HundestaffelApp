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

	public database = null;
	
	constructor(public storage: Storage, public platform: Platform, public sqlite: SQLite) {
		if(this.database == null && platform.is('cordova')){
			this.initDatabase(sqlite);
		} else {
			console.log('Database instance already existing or no cordova available');
		}
		
		// Foreign key support
		this.database.executeSql("PRAGMA foreign_keys = ON;", {}).then(() => {
			console.log("Foreign key support activated.");
		}).catch((error) => {
			console.log("Foreign key support not activated: "+error);
		});
	}

	/**
	 * Add a new trailSet with the passed trailSet.
	 *
	 * @param {Trail} trailSet The trailSet to push to the new trailSet.
	 *
	 * @returns {Promise<string>} Resolves on success, rejects when that trailSet is already existing or
	 * the trailSet couldn't be saved to storage.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	public addNewTrailSet(trailSet: TrailSet):Promise<string>{
		if(this.platform.is('cordova')){
			return this.addNewTrailSet_c(trailSet);
		} else {
			return this.addNewTrailSet_nc(trailSet);
		}
	}
	
	public addNewTrailSet_c(trailSet: TrailSet):Promise<string>{
		return new Promise((resolve, reject) => {
			this.getTrailSet(trailSet.creationID).then((answer) => {
				trailSet.creationID = (parseInt(trailSet.creationID)+1)+"";
				this.addNewTrailSet_c(trailSet).then((answer) => {
					resolve(answer);
				}).catch((error) => {
					reject(error);
				})
			}).catch((error) => {
				// Insert into search table
				let insert_sql = "INSERT INTO `search` VALUES ('"+trailSet.creationID+"', "+trailSet.isLandTrail+", "
					+Date.parse(trailSet.trails[0].startTime.toString())+", "+trailSet.isTraining+", "+trailSet.isSharedTrail+", '"
					+trailSet.preSituation+"', '"+trailSet.situation+"', "+trailSet.temperature+", '"+trailSet.precipitation+"', '"+
					trailSet.risks+"', '"+trailSet.person.name+"')";
				console.error("Search query: "+insert_sql);
				this.database.executeSql(insert_sql, {}).then((answer) => {
					console.log("Search query executed: "+answer+" with "+insert_sql);
				}).catch((error) => {
					console.log("Search query not executed: "+JSON.stringify(error));
				});
				
				// Insert into trail table
				for(let trail of trailSet.trails){
					insert_sql = "INSERT INTO `trails` VALUES ("+trail.id+", "+trailSet.creationID+", '"+trail.trainer+"', "
						+Date.parse(trail.startTime.toString())+", "+Date.parse(trail.endTime.toString())+", "+trail.distance+")";
					console.error("trail query "+insert_sql);
					this.database.executeSql(insert_sql, {}).then((answer) => {
						
						// Insert into position table
						for(let position of trail.path){
							insert_sql = "INSERT INTO `positions` VALUES ("+trailSet.creationID+", "+trail.id+", "+position.lat+", "+position.lng+")";
							this.database.executeSql(insert_sql, {}).then((answer) => {
								console.log("position query executed: "+answer+" with "+insert_sql);
							}).catch((error) => {
								console.log("position query not executed: "+JSON.stringify(error));
							});
						}
						
						// Insert into map_objects table
						for(let map_object of trail.circles){
							let circle_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
								"color, opacity, radius, pos_x1, pos_y1) VALUES ("+trailSet.creationID+", "+trail.id+", "
								+map_object.id+", "+ObjectType.CIRCLE+", '"+map_object.color+"', "+map_object.opacity+", "
								+map_object.radius+", "+map_object.position.lat+", "+map_object.position.lng+")";
							this.database.executeSql(circle_sql, {}).then((answer) => {
								console.log("circle query executed: "+answer+" with "+circle_sql);
							}).catch((error) => {
								console.log("circle query not executed: "+JSON.stringify(error));
							});
						}
						
						for(let map_object of trail.triangles){
							let triangle_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
								"pos_x1, pos_y1, pos_x2, pos_y2, pos_x3, pos_y3) VALUES ("+trailSet.creationID+", "+trail.id+", "
								+map_object.id+", "+ObjectType.TRIANGLE+", "+map_object.usePos[0].lat+", "+map_object.usePos[0].lng+", "
								+map_object.usePos[1].lat+", "+map_object.usePos[1].lng+", "+map_object.usePos[2].lat+", "+map_object.usePos[2].lng+")";
							this.database.executeSql(triangle_sql, {}).then((answer) => {
								console.log("triangle query executed: "+answer+" with "+triangle_sql);
							}).catch((error) => {
								console.log("triangle query not executed: "+JSON.stringify(error));
							});
						}
						
						for(let map_object of trail.marker){
							let marker_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
								"orientation, symbol_id, pos_x1, pos_y1) VALUES ("+trailSet.creationID+", "+trail.id+", "
								+map_object.id+", "+ObjectType.MARKER+", "+map_object.orientation+", "
								+map_object.symbolID+", "+map_object.position.lat+", "+map_object.position.lng+")";
							this.database.executeSql(marker_sql, {}).then((answer) => {
								console.log("marker query executed: "+answer+" with "+marker_sql);
							}).catch((error) => {
								console.log("marker query not executed: "+JSON.stringify(error));
							});
						}
						
						console.log("trail query executed: "+answer+" with "+insert_sql);
					}).catch((error) => {
						console.log("trail query not executed: "+JSON.stringify(error));
					});
				}
				
				// Insert into person table
				let person_sql = "INSERT INTO `persons` VALUES ('"+trailSet.person.name+"', "+trailSet.person.age+", "
					+trailSet.person.glasses+", '"+trailSet.person.hair_choice+"', '"+trailSet.person.hairColor_choice+"', '"
					+trailSet.person.body_choice+"', '"+trailSet.person.allergies+"', '"+trailSet.person.illness+"', '"
					+trailSet.person.medication+"', '"+trailSet.person.image+"')";
				this.database.executeSql(person_sql, {}).then((answer) => {
					console.log("person query executed: "+answer+" with "+person_sql);
				}).catch((error) => {
					console.log("person query not executed: "+JSON.stringify(error));
				});
				
				resolve("Search inserted");
			});
		});
	}
	
	public addNewTrailSet_nc(trailSet: TrailSet):Promise<string>{
		return new Promise((resolve, reject) => {
			this.getTrailSet(trailSet.creationID).then((answer) => {
				reject("TrailSet already existing, aborting... "+answer);
			}).catch((error) => {
				this.storage.ready().then((answer) => {
					this.storage.set(trailSet.creationID, JSON.stringify(trailSet.convertToSimpleObject())).then((answer) => {
						resolve("New TrailSet added "+answer);
					}).catch((error) => {
						reject("TrailSet couldn't be added: "+error);
					});
				}).catch((error) => {
					reject("Internal storage error "+error);
				});
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
	 * @version 1.0.0
	 */
	public addTrailToSet(key: string, trail:Trail, sharedActivity: boolean = false):Promise<string>{
		if(this.platform.is('cordova')){
			return this.addTrailToSet_c(key, trail, sharedActivity);
		} else {
			return this.addTrailToSet_nc(key, trail, sharedActivity);
		}
	}
	
	public addTrailToSet_c(key: string, trail:Trail, sharedActivity: boolean = false):Promise<string>{
		return new Promise((resolve, reject) => {
			
			if(sharedActivity){
				let search_statement = "UPDATE `search` SET is_shared = true WHERE search_id = '"+key+"'";
				this.database.executeSql(search_statement, {}).then((answer) => {
					console.log("Search now marked as shared");
				}).catch((error) => {
					console.log("Shared not updated: "+error);
				});
			}
			
			let insert_sql = "INSERT INTO `trails` VALUES ("+trail.id+", "+key+", '"+trail.trainer+"', "
				+Date.parse(trail.startTime.toString())+", "+Date.parse(trail.endTime.toString())+", "+trail.distance+")";
			console.error("trail query "+insert_sql);
			this.database.executeSql(insert_sql, {}).then((answer) => {
				
				// Insert into position table
				for(let position of trail.path){
					insert_sql = "INSERT INTO `positions` VALUES ("+key+", "+trail.id+", "+position.lat+", "+position.lng+")";
					this.database.executeSql(insert_sql, {}).then((answer) => {
						console.log("position query executed: "+answer+" with "+insert_sql);
					}).catch((error) => {
						console.log("position query not executed: "+JSON.stringify(error));
					});
				}
				
				// Insert into map_objects table
				for(let map_object of trail.circles){
					let circle_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
						"color, opacity, radius, pos_x1, pos_y1) VALUES ("+key+", "+trail.id+", "
						+map_object.id+", "+ObjectType.CIRCLE+", '"+map_object.color+"', "+map_object.opacity+", "
						+map_object.radius+", "+map_object.position.lat+", "+map_object.position.lng+")";
					this.database.executeSql(circle_sql, {}).then((answer) => {
						console.log("circle query executed: "+answer+" with "+circle_sql);
					}).catch((error) => {
						console.log("circle query not executed: "+JSON.stringify(error));
					});
				}
				
				for(let map_object of trail.triangles){
					let triangle_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
						"pos_x1, pos_y1, pos_x2, pos_y2, pos_x3, pos_y3) VALUES ("+key+", "+trail.id+", "
						+map_object.id+", "+ObjectType.TRIANGLE+", "+map_object.usePos[0].lat+", "+map_object.usePos[0].lng+", "
						+map_object.usePos[1].lat+", "+map_object.usePos[1].lng+", "+map_object.usePos[2].lat+", "+map_object.usePos[2].lng+")";
					this.database.executeSql(triangle_sql, {}).then((answer) => {
						console.log("triangle query executed: "+answer+" with "+triangle_sql);
					}).catch((error) => {
						console.log("triangle query not executed: "+JSON.stringify(error));
					});
				}
				
				for(let map_object of trail.marker){
					let marker_sql = "INSERT INTO `map_objects` (search_id, trail_id, object_id, object_type, " +
						"orientation, symbol_id, pos_x1, pos_y1) VALUES ("+key+", "+trail.id+", "
						+map_object.id+", "+ObjectType.MARKER+", "+map_object.orientation+", "
						+map_object.symbolID+", "+map_object.position.lat+", "+map_object.position.lng+")";
					this.database.executeSql(marker_sql, {}).then((answer) => {
						console.log("marker query executed: "+answer+" with "+marker_sql);
					}).catch((error) => {
						console.log("marker query not executed: "+JSON.stringify(error));
					});
				}
				
				console.log("trail query executed: "+answer+" with "+insert_sql);
			}).catch((error) => {
				console.log("trail query not executed: "+JSON.stringify(error));
			});
		});
	}
	
	public addTrailToSet_nc(key: string, trail:Trail, sharedActivity: boolean = false):Promise<string>{
		return new Promise((resolve, reject) => {
			this.getTrailSet(key).then((answer) => {
				let trailSet:TrailSet = TrailSet.fromData(answer);
				trailSet.addTrailToSet(trail);
				if(sharedActivity){
					trailSet.isSharedTrail = true;
				}
				this.storage.ready().then((answer) => {
					this.storage.set(key, JSON.stringify(trailSet.convertToSimpleObject())).then((answer) => {
						resolve("TrailSet updated "+answer);
					}).catch((error) => {
						reject("Could not update trailSet: "+error);
					})
				}).catch((error) => {
					reject("Internal storage error: "+error);
				});
			}).catch((error) => {
				reject("TrailSet not found, creating new trailSet.");
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
	 * @version 1.0.0
	 */
	public removeTrailSet(key: string):Promise<string>{
		if(this.platform.is('cordova')){
			return this.removeTrailSet_c(key);
		} else {
			return this.removeTrailSet_nc(key);
		}
	}
	
	public removeTrailSet_c(key: string):Promise<string>{
		return new Promise((resolve, reject) => {
			this.database.executeSql("SELECT person FROM `search` WHERE search_id = "+key, {}).then((answer) => {
				this.database.executeSql("DELETE FROM `persons` WHERE name = '"+answer.person+"'", {})
					.then(answer => console.log("Person deleted"))
					.catch((error) => console.log("Couldn't find search with key "+key));
				
				this.database.executeSql("SELECT trail_id FROM `trails` WHERE name = '"+answer.person+"'", {})
					.then(answer => console.log("Person deleted"))
					.catch((error) => console.log("Couldn't find search with key "+key));
			});
		});
	}
	
	public removeTrailSet_nc(key: string):Promise<string>{
		return new Promise((resolve, reject) => {
			this.getTrailSet(key).then((answer) => {
				this.storage.ready().then((answer) => {
					this.storage.remove(key).then((answer) => {
						resolve("TrailSet removed");
					}).catch((error) => {
						reject("Couldn't remove trailSet: "+error);
					});
				}).catch((error) => {
					reject("Internal storage error: "+error);
				});
			}).catch((error) => {
				reject("TrailSet not found: "+error);
			});
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
		if(this.platform.is('cordova')){
			return this.getTrailSet_c(key);
		} else {
			return this.getTrailSet_nc(key);
		}
	}
	
	public getTrailSet_c(key: string):Promise<TrailSet>{
		return new Promise<TrailSet>((resolve, reject) => {
			this.storage.ready().then((answer) => {
				this.storage.get(key).then((answer) => {
					if(answer === null){
						reject("trailSet not found");
					}
					resolve(TrailSet.fromData(JSON.parse(answer)));
				}).catch((error) => {
					reject("Couldn't get trailSet: "+error);
				});
			}).catch((error) => {
				reject("Internal storage error: "+error);
			});
		});
	}
	
	public getTrailSet_nc(key: string):Promise<TrailSet>{
		return new Promise<TrailSet>((resolve, reject) => {
			this.storage.ready().then((answer) => {
				this.storage.get(key).then((answer) => {
					if(answer === null){
						reject("trailSet not found");
					}
					resolve(TrailSet.fromData(JSON.parse(answer)));
				}).catch((error) => {
					reject("Couldn't get trailSet: "+error);
				});
			}).catch((error) => {
				reject("Internal storage error: "+error);
			});
		});
	}

	/**
	 * Get the last x trailSets from the storage. Not optimized for big amounts.
	 *
	 * @param {number} amount The amount of trailSets to fetch.
	 *
	 * @returns {Observable<Trail[]>} Returns one trailSet in each push. Throws an error if data couldn't be retrieved.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	public getLatestTrailSets(amount:number = 0):Observable<TrailSet>{
		if(this.platform.is('cordova')){
			return this.getLatestTrailSets_c(amount);
		} else {
			return this.getLatestTrailSets_nc(amount);
		}
	}
	
	public getLatestTrailSets_c(amount:number = 0):Observable<TrailSet>{
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
							observer.error("Couldn't fetch trailSet: "+error);
						});
					}
				}).catch((error) => {
					observer.error("Couldn't fetch keys: "+error);
				});
			});
		});
	}
	
	public getLatestTrailSets_nc(amount:number = 0):Observable<TrailSet>{
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
							observer.error("Couldn't fetch trailSet: "+error);
						});
					}
				}).catch((error) => {
					observer.error("Couldn't fetch keys: "+error);
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
			
			// Search table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `search` ( search_id NUMERIC, search_type TEXT, search_date NUMERIC, is_training TEXT, is_shared TEXT, pre_situation TEXT, situation TEXT, temperature TEXT, precipitation TEXT, risks TEXT, person_name TEXT, PRIMARY KEY (search_id) );", {}).then(() => {
				console.log("Search table inserted");
			}).catch((error) => {
				console.log("Search table not inserted: "+error);
			});
			
			// Trails table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `trails` ( trail_id INTEGER, search_id NUMERIC, trainer TEXT, start_time NUMERIC, end_time NUMERIC, distance REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, PRIMARY KEY (search_id, trail_id) );", {}).then(() => {
				console.log("Trails table inserted");
			}).catch((error) => {
				console.log("Trails table not inserted: "+error);
			});
			
			// Positions table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `positions` ( search_id NUMERIC, trail_id INTEGER, pos_x REAL, pos_y REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, FOREIGN KEY (trail_id) REFERENCES trails (trail_id) ON DELETE CASCADE );", {}).then(() => {
				console.log("Positions table inserted");
			}).catch((error) => {
				console.log("Positions table not inserted: "+error);
			});
			
			// Map objects table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `map_objects` ( search_id NUMERIC, trail_id INTEGER, object_id INTEGER, object_type INTEGER, color TEXT, opacity REAL, radius REAL, orientation REAL, symbol_id INTEGER, pos_x1 REAL, pos_y1 REAL, pos_x2 REAL, pos_y2 REAL, pos_x3 REAL, pos_y3 REAL, FOREIGN KEY (search_id) REFERENCES search (search_id) ON DELETE CASCADE, FOREIGN KEY (trail_id) REFERENCES trail (trail_id) ON DELETE CASCADE, PRIMARY KEY (search_id, trail_id, object_id) );", {}).then(() => {
				console.log("Map objects table inserted");
			}).catch((error) => {
				console.log("Map objects table not inserted: "+error);
			});
			
			// Persons table
			this.database.executeSql("CREATE TABLE IF NOT EXISTS `persons` ( name TEXT, age INTEGER, glasses BOOLEAN, hair_style TEXT, hair_color TEXT, body_type TEXT, allergies TEXT, illness TEXT, medication TEXT, image TEXT );", {}).then(() => {
				console.log("Persons table inserted");
			}).catch((error) => {
				console.log("Persons table not inserted: "+error);
			});
		}).catch((error) => {
			console.log('Database not opened: '+JSON.stringify(error));
		});
	}
	
	//TODO Debug -> Entfernen!!!!!
	public deleteDatabase(){
		this.sqlite.deleteDatabase({name: 'trailStorage.db', location: 'default'}).then( (answer) => {
			console.log("Database deleted: "+answer);
		}).catch((error) => {
			console.log("Database not deleted: "+error);
		})
	}
}
