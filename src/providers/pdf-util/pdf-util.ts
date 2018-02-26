import {Injectable} from '@angular/core';
import {LoadingController, Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Trail} from "../../models/trail";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TranslateService} from "@ngx-translate/core";
import {TrailSet} from "../../models/trailSet";

import html2canvas from "html2canvas/dist/html2canvas"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Provider used to create a new PDF and share it.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Injectable()
export class PdfUtilProvider {
	/**
	 * The directory in which the PDF shall be saved.
	 *
	 * @since 1.0.0
	 */
	pdfDirectory;
	
	/**
	 * The name of the file to create.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	fileName:string = "";
	
	/**
	 * Name of the app to set the correct filePath.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	appName: string = "IonicApp";
	
	/**
	 * Array containing all translated terms used in this class.
	 *
	 * @type {string[]}
	 * @since 1.0.0
	 */
	translate: Array<string> = [];
	
	constructor(public platform: Platform, public fileSystem: File, public sharing: SocialSharing, public translateService: TranslateService, public loadingCtrl: LoadingController) {
		if(this.platform.is('ios')) {
			this.pdfDirectory = this.fileSystem.documentsDirectory;
		}
		if(this.platform.is('android')){
			this.pdfDirectory = this.fileSystem.externalRootDirectory;
		}
		this.translateVariables();
	}
	
	/**
	 * Method called to translate all terms in this class.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("TRAIL_FROM", "TRAIL_DURATION", "FOR", "TRAIL_TYPE", "TRAIL_LAND", "TRAIL_WATER", "TRAIL_OPERATION", "TRAIL_TRAINING", "TRAIL_TRAINER_NAME", "WITH", "IMPORT_CREATING_PDF", "HOURS", "MINUTES", "SECONDS");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translate[term.toLowerCase()] = answer;
			});
		}
	}
	
	/**
	 * Method to get the duration between two Date objects using the moment.js library
	 *
	 * @param {Date} startTime
	 * @param {Date} endTime
	 * @returns {string}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private getDuration(startTime: Date, endTime: Date):number{
		let _startTime = moment(startTime);
		let _endTime = moment(endTime);
		
		return moment(_endTime.diff(_startTime)).toDate().getTime();
	}
	
	/**
	 * Method to check if the directory to save the PDFs in is existing or needs to be created.
	 *
	 * @returns {Promise<string>} Resolves when the directory exists or was created, else it rejects.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
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
	
	/**
	 * Method called to create a new PDF and fill it with content.
	 *
	 * @param trailSet The trailSet used as content.
	 * @param map A reference to the map object in order to create screenshot of the map.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private createPdf(trailSet: TrailSet, map):Promise<string>{
		return new Promise<string>((resolve, reject) => {
			this.fileName = 'trail_'+trailSet.creationID+'.pdf';
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
	
	/**
	 * Method called to generate the content of the new PDF file.
	 *
	 * @param {TrailSet} trailSet The trailSet used as content,
	 * @param mapElement A reference to the mapElement in order to print an image of the map.
	 * @returns {Promise<Object>} Resolves when all content was generated, else it rejects.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private generateContent(trailSet: TrailSet, mapElement):Promise<Object>{
		return new Promise<Object>((resolve, reject) => {
			html2canvas(mapElement.nativeElement, {
				allowTaint: false,
				useCORS: true,
				logging: true
			}).then((canvas) => {
				let training = (trailSet.isTraining) ? this.translate["trail_training"] : this.translate["trail_operation"];
				let activity = (trailSet.isLandTrail) ? this.translate["trail_land"] : this.translate["trail_water"];
				let map = canvas.toDataURL("img/png");
				let dogs = [];
				trailSet.trails.forEach((value: Trail) => {
					dogs.push({text: this.translate["trail_trainer_name"] +' '+value.trainer+' '+this.translate["with"]+' '+value.dog+' '+
						this.translate["for"]+' '+this.getDuration(value.startTime, value.endTime), color: value.trailColor});
				});
				
				resolve({
					content: [
						{text: this.translate["trail_from"]+' '+trailSet.trails[0].startTime, fontSize: 18, alignment: 'center'},
						{text: '\n'+this.translate["trail_duration"]+' '+this.getDuration(trailSet.trails[0].startTime, trailSet.trails[trailSet.trails.length-1].endTime), fontSize: 13, alignment: 'center'},
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
	
	/**
	 * Method called to create and share a PDF.
	 *
	 * @param {TrailSet} trailSet The trailSet to create a PDF of.
	 * @param map A reference to the map Element in order to capture an image of the map.
	 * @returns {Promise<string>} Resolves when the PDF was created and the sharing dialog opens, else rejects.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	sharePdf(trailSet: TrailSet, map):Promise<string>{
		let loading = this.loadingCtrl.create({
			content: this.translate["import_creating_pdf"]
		});
		loading.present();
		return new Promise((resolve, reject) => {
			this.initDirectory().then((answer) => {
				this.createPdf(trailSet, map).then((answer) => {
					loading.dismiss();
					this.sharing.share(null, null, this.pdfDirectory+this.appName+'/'+this.fileName, null).then((answer) => {
						resolve("Successfully shared");
					}).catch((reason) => {
						reject(reason);
					});
				}).catch((reason) => {
					loading.dismiss();
					reject(reason);
				});
			}).catch((error) => {
				reject(error);
			});
		});
	}
}
