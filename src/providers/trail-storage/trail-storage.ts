import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Trail} from "../../models/trail";
import {Observable} from "rxjs/Observable";
import {TrailSet} from "../../models/trailSet";

/**
 * Provider to interact with the database in order to save new trails, add them to a trailSet, display trailSets or delete a trailSet.
 */
@Injectable()
export class TrailStorageProvider {

	constructor(public storage: Storage) {
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
	 * Fetch multiple trailSets from the storage.
	 *
	 * @param {number} from Beginning of the selection. If left all trailSets from the beginning to limit are returned.
	 * @param {number} limit Limit of the selection. If left 0, it returns all remaining trailSets.
	 *
	 * @returns {Observable<Trail[]>} Returns one trailSet in each push. Throws errors if the data couldn't be retrieved from the storage.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	public getTrailSets(from:number = 0, limit:number = 0):Observable<TrailSet>{
		return new Observable<TrailSet>((observer) => {
			// TODO: Performanter machen
			this.storage.ready().then((answer) => {
				this.storage.forEach((value, key, iterationNumber) => {
					if(limit !== 0 && (<number>iterationNumber)-from > limit){
						// TODO: BREAK
						observer.complete();
					}
					if(iterationNumber >= from && ((<number>iterationNumber)-from < limit || limit === 0)){
						observer.next(TrailSet.fromData(JSON.parse(value)));
					}
				}).then((answer) => {
					observer.complete();
				}).catch((error) => {
					observer.error("Couldn't retrieve trailSets: "+error);
				});
			}).catch((error) => {
				observer.error("Internal storage error: "+error);
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
	 * Update the schema of the existing entries in the storage. WARNING: INTESIVE OPERATION, CANNOT BE UNDONE!
	 *
	 * @param schemeChanges[] Array containing the schema changes in the form of ["oldProperty=>newProperty",...]
	 *
	 * @returns {Promise<string>} Resolves on successful update, rejects on error and creates a data dump of the existing entries.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	public updateSchema(schemeChanges: string[]):Promise<string>{
		return new Promise((resolve, reject) => {
			// TODO: Create method
		});
	}
}
