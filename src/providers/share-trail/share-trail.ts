import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Trail} from "../../models/trail";

@Injectable()
export class ShareTrailProvider {
	
	constructor(public fileSystem: File, public sharing: SocialSharing) {
	}
	
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
	
	private shareTrail(trail: Trail[]):Promise<string> {
		return new Promise((resolve, reject) => {
			this.fileSystem.checkFile(this.fileSystem.cacheDirectory, "shared/test.json").then((reason) => {
				resolve("File already existing");
			}).catch((reason) => {
				this.fileSystem.writeFile(this.fileSystem.cacheDirectory, "shared/test.json", JSON.stringify(trail)).then((reason) => {
					resolve("File created");
				}).catch((reason) => {
					reject("File not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	share(trail: Trail[]):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((reason) => {
				this.shareTrail(trail).then((answer) => {
					this.sharing.share(null, null, this.fileSystem.cacheDirectory+"shared/test.json", null).then((answer) => {
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
