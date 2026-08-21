import { Component, inject, linkedSignal, signal } from '@angular/core';
import { List } from '../../components/list/list';
import { CountryService } from '../../services/country.service';
import { Region, REGIONS } from '../../interfaces/country.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

function validateQueryParam(queryParam: string): Region | null {
  const queryParamsNormalized = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[queryParamsNormalized] ?? null;
}

@Component({
  selector: 'app-by-region-page',
  imports: [List],
  templateUrl: './by-region-page.html',
})
export class ByRegionPage {
  public regions = REGIONS;
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';
  region = linkedSignal(() => this.queryParam);

  selectedRegion = linkedSignal<Region | null>(() => validateQueryParam(this.region()));

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
  }

  countryResource = rxResource({
    params: () => ({ selectedRegion: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.selectedRegion) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: params.selectedRegion,
        },
      });

      return this.countryService.searchByRegion(params.selectedRegion);
    },
  });
}
