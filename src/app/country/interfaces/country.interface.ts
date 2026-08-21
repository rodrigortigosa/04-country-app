export interface Country {
  alpha2Code: string;
  capitalNames: string[];
  flag: Flag;
  name: string;
  population: number;
  region: string;
  subRegion: string;
}

interface Flag {
  description: string;
  icon: string;
  png: string;
}

export const REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctic',
] as const;

export type Region = typeof REGIONS[number]
