import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFound } from '../../../shared/components/not-found/not-found';
import { Loading } from '../../../shared/components/loading/loading';
import { CountryInformation } from './country-information/country-information';

@Component({
  selector: 'app-country-page',
  imports: [NotFound, Loading, CountryInformation],
  templateUrl: './country-page.html',
})
export class CountryPage {
  // opcion 1
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  // opcion 2
  // countryCode = inject(ActivatedRoute).snapshot.paramMap.get('code');

  countryService = inject(CountryService);

  countryResource = rxResource({
    params: () => ({ code: this.countryCode }),
    stream: ({ params }) => {
      return this.countryService.searchCountryByAlphaCode(params.code);
    },
  });
}
