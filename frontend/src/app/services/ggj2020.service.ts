import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GGJ2020Service {

  private endpoint : string = "http://localhost:8080/api";

  constructor(private http: HttpClient) {
        // setup the endpoint
       // this.endpoint = (!environment.formfiller_service_endpoint)?
         //     "http://localhost:9000" : environment.formfiller_service_endpoint ;

  }

  public getStuff() : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin': '*'//`${this.endpoint}`
      })
    };
    
    return this.http.get<any>(`${this.endpoint}/users/1`, httpOptions);
  }


}
