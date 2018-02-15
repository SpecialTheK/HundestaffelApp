import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Trail} from "../../models/trail";
import {SocialSharing} from "@ionic-native/social-sharing";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

@Injectable()
export class PdfUtilProvider {
	
	pdfDirectory = this.fileSystem.dataDirectory+'pdf/';
	fileName:string = "";
	
	constructor(public platform: Platform, public fileSystem: File, public sharing: SocialSharing) {
		if (this.platform.is('ios')) {
			this.pdfDirectory = this.fileSystem.documentsDirectory+'pdf/';
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
	
	private createPdf(trailSet: Trail[]):Promise<string>{
		return new Promise<string>((resolve, reject) => {
			this.fileName = 'trail_'+trailSet[0].startTime+'.pdf';
			this.fileSystem.checkFile(this.pdfDirectory, this.fileName).then((reason) => {
				resolve("File already existing");
			}).catch((reason) => {
				this.fileSystem.writeFile(this.pdfDirectory, this.fileName, JSON.stringify(trailSet)).then((reason) => {
					resolve("File created");
				}).catch((reason) => {
					reject("File not created: "+JSON.stringify(reason));
				});
			});
		})
	}
	
	sharePdf(trailSet: Trail[]):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((reason) => {
				this.createPdf(trailSet).then((answer) => {
					this.sharing.share(null, null, this.pdfDirectory+this.fileName, null).then((answer) => {
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
