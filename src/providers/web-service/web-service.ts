import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class WebServiceProvider {

  constructor(public http: HttpClient) {

  }

  createSession(ip_addr: string, username: string, pw?: string): string {
    this.http.post((ip_addr + "/createsession"), {
      username: username,
      pw: pw
    }).subscribe((res) => {
      console.log(res);
    });

    return "";
  }

  joinSession(ip_addr: string, session_id: string, username: string, pw?: string) {
    this.http.post((ip_addr + "/joinsession"), {
      session_id: session_id,
      username: username,
      pw: pw
    }).subscribe((res) => {
      console.log(res);
    });
  }

  postTrailData(ip_addr: string, session_id: string, username: string, data: any) {
    this.http.post((ip_addr + "/postdata"), {
      session_id: session_id,
      username: username,
      data: data
    }).subscribe((res) => {
      console.log(res);
    });
  }

}
