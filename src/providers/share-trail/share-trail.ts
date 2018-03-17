import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TrailSet} from "../../models/trailSet";

/**
 * Provider used to share a trailSet in the apps file format.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Injectable()
export class ShareTrailProvider {
	
	/**
	 * Path where the file shall be stored.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	filePath: string = "";
	
	/**
	 * Name of the file to share.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	fileName: string = "";
	
	constructor(public fileSystem: File, public sharing: SocialSharing) {
		this.filePath = this.fileSystem.cacheDirectory+'shared/';
	}
	
	/**
	 * Method called to check if the directory used for storing the files is existing or else to create said directory.
	 *
	 * @returns {Promise<string>} Resolves when the directory is existing or was created, else rejects.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private initDirectory():Promise<string>{
		return new Promise((resolve, reject) => {
			this.fileSystem.checkDir(this.fileSystem.cacheDirectory, 'shared').then((reason) => {
				resolve("Shared directory existing");
			}).catch((error) => {
				this.fileSystem.createDir(this.fileSystem.cacheDirectory, 'shared', false).then((message) => {
					resolve("Shared directory created");
				}).catch((reason) => {
					reject("Shared directory not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	/**
	 * Method called to create a new file and fill it with the trailSet.
	 *
	 * @param {Trail[]} trailSet The trailSet to write into the file.
	 * @returns {Promise<string>} Resolves when the file was written.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private createFile(trailSet: TrailSet):Promise<string> {
		return new Promise((resolve, reject) => {
			this.fileName = 'trail_'+trailSet.creationID+'.wny';
			this.fileSystem.checkFile(this.filePath, this.fileName).then((reason) => {
				resolve("File already existing");
			}).catch((reason) => {
				this.fileSystem.writeFile(this.filePath, this.fileName, JSON.stringify(trailSet.convertToSimpleObject())).then((reason) => {
					resolve("File created");
				}).catch((reason) => {
					reject("File not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	/**
	 * Method used to create a new file containing the trailSet and then share it.
	 *
	 * @param {Trail[]} trailSet The trailSet to share.
	 * @returns {Promise<string>} Resolves when the file was successfully written and the share popover gets displayed.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	shareTrail(trailSet: TrailSet):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((reason) => {
				this.createFile(trailSet).then((answer) => {
					this.sharing.share(null, null, this.filePath+this.fileName, null).then((answer) => {
						resolve("Successfully shared");
					}).catch((reason) => {
						reject(reason);
					});
				}).catch((reason) => {
					reject(reason);
				});
			}).catch((reason) => {
				reject(reason);
			});
		});
	}
}
