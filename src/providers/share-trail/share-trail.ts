import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Trail} from "../../models/trail";

@Injectable()
export class ShareTrailProvider {
	
	filePath: string = "";
	fileName: string = "";
	
	constructor(public fileSystem: File, public sharing: SocialSharing) {
		this.filePath = this.fileSystem.cacheDirectory+'shared/';
	}
	
	private initDirectory():Promise<string>{
		return new Promise((resolve, reject) => {
			this.fileSystem.checkDir(this.fileSystem.cacheDirectory, 'shared').then((reason) => {
				console.log("Directory existing");
				resolve("Shared directory existing");
			}).catch((error) => {
				this.fileSystem.createDir(this.fileSystem.cacheDirectory, 'shared', false).then((message) => {
					resolve("Shared directory created");
					console.log("Directory created");
				}).catch((reason) => {
					console.log("Shared directory not created: "+JSON.stringify(reason));
					reject("Shared directory not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	private createFile(trail: Trail[]):Promise<string> {
		return new Promise((resolve, reject) => {
			this.fileName = 'trail_'+trail[0].startTime+'.xri';
			this.fileSystem.checkFile(this.filePath, this.fileName).then((reason) => {
				console.log("File existing");
				resolve("File already existing");
			}).catch((reason) => {
				this.fileSystem.writeFile(this.filePath, this.fileName, JSON.stringify(trail)).then((reason) => {
					console.log("File created");
					resolve("File created");
				}).catch((reason) => {
					console.log("File not created; "+JSON.stringify(reason));
					reject("File not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	shareTrail(trail: Trail[]):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((reason) => {
				this.createFile(trail).then((answer) => {
					this.sharing.share(null, null, this.filePath+this.fileName, null).then((answer) => {
						console.log("Shared");
						resolve("Successfully shared");
					}).catch((reason) => {
						console.log("Reject1: "+reason);
						reject(reason);
					});
				}).catch((reason) => {
					console.log("reject2: "+reason);
					reject(reason);
				});
			}).catch((reason) => {
				console.log("Reject3: "+reason);
				reject(reason);
			});
		});
	}
}
