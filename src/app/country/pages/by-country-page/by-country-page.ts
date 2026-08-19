import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInput } from '../../components/search-input/search-input';
import { List } from '../../components/list/list';
import { CountryService } from '../../services/country.service';
import { /* map, */ of } from 'rxjs';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInput, List],
  templateUrl: './by-country-page.html',
})
export class ByCountryPage {
  countryService = inject(CountryService);

  query = signal('');

  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (!params.query || params.query.trim() === '') return of([]);

      /* return this.countryService.searchByCountry(params.query).pipe(
        map((result) => {
          if (result.length === 0) {
            throw new Error(`No se encontraron resultados para el país "${params.query}".`);
          }

          return result;
        }),
      ); */
      return this.countryService.searchByCountry(params.query);
    },
  });

  countries = computed(() => (this.countryResource.hasValue() ? this.countryResource.value() : []));

  isLoading = computed(() => this.countryResource.isLoading());

  isEmpty = computed(
    () =>
      this.query().trim().length > 0 &&
      this.countryResource.hasValue() &&
      this.countries().length === 0,
  );

  errorMessage = computed(() => {
    const error = this.countryResource.error();

    return error instanceof Error ? error.message : null;
  });
}
