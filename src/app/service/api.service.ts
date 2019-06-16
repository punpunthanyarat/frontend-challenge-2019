import { Injectable } from '@angular/core';
import { environment } from '../.././environments/environment';
import { HttpRequest, HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { Body } from '@angular/http/src/body';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  get_location(query) {
    const params = new HttpParams()
    .append('key', environment.CONSUMER_API_KEY)
    .append('idxSet', 'Geo');
    return this.http.get(environment.API_LOCATION_URL + '/search/2/search/' + query + '.json?', { params });
  }
  get_current_weather(lat, lon) {
    const params = new HttpParams()
    .append('lat', lat)
    .append('lon', lon)
    .append('cnt', '10')
    .append('appid', environment.APP_ID);
    return this.http.get(environment.API_OPENWEATHER_URL + '/data/2.5/find?', { params });
  }
  get_icon() {
    return this.http.get(environment.API_ICON_URL + '/img/w/' + '10d.png');
  }
  get_24hr(lat, lon, id) {
    let params = new HttpParams()
    .append('lat', lat)
    .append('lon', lon)
    .append('appid', environment.APP_ID);
    if (id === 1) {
    } else if (id === 2) {
       params = params
      .append('units', 'imperial');
    } else {
      params = params
      .append('units', 'metric');
    }
    return this.http.get(environment.API_OPENWEATHER_URL + '/data/2.5/forecast?', { params });
  }
}
