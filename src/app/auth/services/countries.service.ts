import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl = 'http://localhost:8080/countries';

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get<Country[]>(this.baseUrl);
  }

}
