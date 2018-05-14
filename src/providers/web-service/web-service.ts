import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from "rxjs/Observable";

@Injectable()
export class WebServiceProvider {



  constructor(public http: HttpClient) {

  }

  createSession(ip_addr: string, pw: string): Observable<Object> {
    return this.http.post((ip_addr + "/createsession"), {
      pw: pw
    });
  }

  joinSession(ip_addr: string, session_id: string, username: string, pw: string): Observable<Object>  {
    return this.http.post((ip_addr + "/joinsession"), {
      sid: session_id,
      username: username,
      pw: pw
    });
  }

  postTrailData(ip_addr: string, session_id: string, username: string, data: any): Observable<Object> {
    return this.http.post((ip_addr + "/postdata"), {
      session_id: session_id,
      username: username,
      data: data
    });
  }

}
