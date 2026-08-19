import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { RESTCountriesResponse } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mapper/country.mapper';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';

const API_BASE_URL = environment.restCountriesApiBaseURL;
const API_KEY = environment.restCountriesApiKey;

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    const normalizedQuery = query.toLowerCase();

    const url = `${API_BASE_URL}/capitals?q=${normalizedQuery}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(() => new Error(`No se pudo obtener paises con el query "${query}".`));
        }),
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const normalizedQuery = query.toLowerCase();

    const url = `${API_BASE_URL}/names.common?q=${normalizedQuery}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        delay(2000),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(() => new Error(`No se pudo obtener paises con el query "${query}".`));
        }),
      );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | undefined> {
    const url = `${API_BASE_URL}/codes.alpha_2/${code}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        map((countries) => countries.at(0)),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(() => new Error(`No se pudo obtener el país con el código "${code}".`));
        }),
      );
  }
}
