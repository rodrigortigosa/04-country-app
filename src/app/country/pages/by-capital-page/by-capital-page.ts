import { Component, inject, resource, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { List } from '../../components/list/list';
import { CountryService } from '../../services/country.service';
// import type { Country } from '../../interfaces/country.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInput, List],
  templateUrl: './by-capital-page.html',
})
export class ByCapitalPage {
  countryService = inject(CountryService);

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   /* this.countryService.searchByCapital(query).subscribe((countries) => {
  //     this.isLoading.set(false);
  //     this.countries.set(countries);
  //   }); */

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);

  //       if (countries.length === 0)
  //         this.isError.set(`No se encontró un país con la capital "${query}".`);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     },
  //   });
  // }

  query = signal('');

  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      if (!params.query || params.query.trim() === '') return [];

      const result = await firstValueFrom(this.countryService.searchByCapital(params.query));

      /* if (result.length === 0) {
        // ===> Clave para lanzar un error
        throw new Error(`No se encontraron resultados para la capital "${params.query}".`);
      } */

      return result;
    },
  });
}
