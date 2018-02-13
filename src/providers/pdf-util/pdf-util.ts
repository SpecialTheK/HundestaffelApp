import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Trail} from "../../models/trail";
import {SocialSharing} from "@ionic-native/social-sharing";

@Injectable()
export class PdfUtilProvider {
	
	pdfDirectory = this.fileSystem.dataDirectory;
	
	constructor(public platform: Platform, public fileSystem: File, public sharing: SocialSharing) {
		if (this.platform.is('ios')) {
			this.pdfDirectory = this.fileSystem.documentsDirectory
		}
	}
	
	private initDirectory():Promise<string>{
		return new Promise((resolve, reject) => {
			this.fileSystem.checkDir(this.pdfDirectory, 'pdf').then((reason) => {
				resolve("PDF directory existing");
			}).catch((error) => {
				this.fileSystem.createDir(this.pdfDirectory, 'pdf', false).then((message) => {
					resolve("PDF directory created");
				}).catch((reason) => {
					reject("PDF directory not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	createPdf(trailSet: Trail[]):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((answer) => {
				
				this.sharing.share(null, null, this.fileSystem.cacheDirectory+"shared/test.json", null).then((answer) => {
					resolve("Successfully shared");
				}).catch((reason) => {
					reject(reason);
				});
			}).catch((error) => {
				reject(error);
			})
		});
	}
	
}
