import {Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Trail} from "../../models/trail";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TranslateService} from "@ngx-translate/core";

import html2canvas from "html2canvas/dist/html2canvas"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfUtilProvider {
	pdfDirectory;
	fileName:string = "";
	appName: string = "IonicApp";
	translate: Array<string> = [];
	
	constructor(public platform: Platform, public fileSystem: File, public sharing: SocialSharing, public translateService: TranslateService) {
		if(this.platform.is('ios')) {
			this.pdfDirectory = this.fileSystem.documentsDirectory;
		}
		if(this.platform.is('android')){
			this.pdfDirectory = this.fileSystem.externalRootDirectory;
		}
		this.translateVariables();
	}
	
	private translateVariables(){
		let translateTerms = Array("TRAIL_FROM", "TRAIL_DURATION", "FOR", "TRAIL_TYPE", "TRAIL_LAND", "TRAIL_WATER", "TRAIL_OPERATION", "TRAIL_TRAINING", "TRAIL_TRAINER_NAME", "WITH");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translate[term.toLowerCase()] = answer;
			});
		}
	}
	
	private initDirectory():Promise<string>{
		return new Promise((resolve, reject) => {
			this.fileSystem.checkDir(this.pdfDirectory, this.appName).then((reason) => {
				resolve("PDF directory existing");
			}).catch((error) => {
				this.fileSystem.createDir(this.pdfDirectory, this.appName, false).then((message) => {
					resolve("PDF directory created");
				}).catch((reason) => {
					reject("PDF directory not created: "+JSON.stringify(reason));
				});
			});
		});
	}
	
	private createPdf(trailSet: Trail[], map):Promise<string>{
		return new Promise<string>((resolve, reject) => {
			this.fileName = 'trail_'+trailSet[0].startTime+'.pdf';
			this.fileSystem.checkFile(this.pdfDirectory+this.appName+'/', this.fileName).then((reason) => {
				resolve("File already existing");
			}).catch((reason) => {
				this.generateContent(trailSet, map).then((content) => {
					let pdf = pdfMake.createPdf(content);
					pdf.getBuffer((buffer) => {
						let utf8 = new Uint8Array(buffer);
						let binaryArray = utf8.buffer;
						let blob = new Blob([binaryArray], {type: 'application/pdf'});
						this.fileSystem.writeFile(this.pdfDirectory+this.appName+'/', this.fileName, blob).then((reason) => {
							resolve("File created");
						}).catch((reason) => {
							reject("File not created: "+JSON.stringify(reason));
						});
					});
				}).catch((error) => {
					reject(error);
				});
			});
		});
	}
	
	private generateContent(trailSet: Trail[], mapElement):Promise<Object>{
		return new Promise<Object>((resolve, reject) => {
			html2canvas(mapElement.nativeElement, {
				allowTaint: false,
				useCORS: true,
				logging: true
			}).then((canvas) => {
				let totalTime:number = (trailSet[trailSet.length-1].endTime)-(trailSet[0].startTime);
				let training = (trailSet[0].isTraining) ? this.translate["trail_training"] : this.translate["trail_operation"];
				let activity = (trailSet[0].isLandActivity) ? this.translate["trail_land"] : this.translate["trail_water"];
				let map = canvas.toDataURL("img/png");
				let dogs = [];
				trailSet.forEach((value) => {
					dogs.push({text: this.translate["trail_trainer_name"] +' '+value.trainer+' '+this.translate["with"]+' '+value.dog+' '+
						this.translate["for"]+' '+(value.endTime-value.startTime), color: 'red'});
				});
				
				resolve({
					content: [
						{text: this.translate["trail_from"]+' '+trailSet[0].startTime, fontSize: 18, alignment: 'center'},
						{text: '\n'+this.translate["trail_duration"]+' '+totalTime, fontSize: 13, alignment: 'center'},
						{text: '\n\n\n\n'+this.translate["trail_type"]+ ' '+training+", "+activity+'\n\n', fontSize: 13},
						{image: map, width: 400, alignment: 'center'},
						'\n\n\n',
						{stack: dogs}
					]
				});
			}).catch((error) => {
				reject(error);
			});
		});
	}
	
	sharePdf(trailSet: Trail[], map):Promise<string>{
		return new Promise((resolve, reject) => {
			this.initDirectory().then((answer) => {
				this.createPdf(trailSet, map).then((answer) => {
					this.sharing.share(null, null, this.pdfDirectory+this.fileName, null).then((answer) => {
						resolve("Successfully shared");
					}).catch((reason) => {
						reject(reason);
					});
				}).catch((reason) => {
					reject(reason);
				});
			}).catch((error) => {
				reject(error);
			});
		});
	}
}
