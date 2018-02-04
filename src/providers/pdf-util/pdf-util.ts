import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {File} from "@ionic-native/file";

/*
  Generated class for the PdfUtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PdfUtilProvider {
	
	pdfDirectory = this.fileSystem.dataDirectory;
	directoryExisting: Promise<string>;
	
	constructor(public platform: Platform, public fileSystem: File) {
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
	
}
