import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { RESTCountriesResponse } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mapper/country.mapper';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { type Country, type Region } from '../interfaces/country.interface';

const API_BASE_URL = environment.restCountriesApiBaseURL;
const API_KEY = environment.restCountriesApiKey;

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private regionCache = new Map<Region, Country[]>();

  searchByCountry(query: string): Observable<Country[]> {
    const normalizedQuery = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []); /* .pipe(
        delay(2000)
      ); */ // Como es un Observable se le puede poner el .pipe
    }
    const url = `${API_BASE_URL}/names.common?q=${normalizedQuery}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    console.log(`llegando al servidor por ${query}`);

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        tap((countries) => this.queryCacheCountry.set(query, countries)),
        delay(2000),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(() => new Error(`No se pudo obtener paises con el query "${query}".`));
        }),
      );
  }

  searchByCapital(query: string): Observable<Country[]> {
    const normalizedQuery = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    const url = `${API_BASE_URL}/capitals?q=${normalizedQuery}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        tap((countries) => this.queryCacheCapital.set(query, countries)),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(() => new Error(`No se pudo obtener paises con el query "${query}".`));
        }),
      );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    if (this.regionCache.has(region)) {
      return of(this.regionCache.get(region) ?? []);
    }
    const url = `${API_BASE_URL}/region/${region}`;
    const headers = { Authorization: `Bearer ${API_KEY}` };

    return this.http
      .get<RESTCountriesResponse>(url, {
        headers,
      })
      .pipe(
        map(({ data }) => data.objects),
        map((countries) => CountryMapper.mapRestCountriesToCountriesArray(countries)),
        tap((countries) => this.regionCache.set(region, countries)),
        catchError((error) => {
          console.error(`Error fetching ${error}`);

          return throwError(
            () => new Error(`No se pudo obtener paises con la región "${region}".`),
          );
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
