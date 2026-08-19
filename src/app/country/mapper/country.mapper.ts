import type { Country } from '../interfaces/country.interface';
import type { RestCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  // static RestCountry => Country
  static mapRestCountryToCountry(restCountry: RestCountry): Country {
    return {
      capitalNames: restCountry.capitals.map((capital) => capital.name),
      flag: {
        icon: restCountry.flag.emoji,
        png: restCountry.flag.url_png,
        description: restCountry.flag.description,
      },
      name: restCountry.names.translations['spa'].common ?? 'Sin nombre en español',
      population: restCountry.population,
      alpha2Code: restCountry.codes.alpha_2,
      region: restCountry.region,
      subRegion: restCountry.subregion,
    };
  }

  //static  RestCountry[] => Country[]
  static mapRestCountriesToCountriesArray(restCountries: RestCountry[]): Country[] {
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
