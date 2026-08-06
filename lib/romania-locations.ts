import locationsData from "@/data/romania-locations.json";

export type RomaniaCounty = {
  county: string;
  code: string;
  cities: string[];
};

export const romaniaLocations =
  locationsData as RomaniaCounty[];

export const romaniaCounties =
  romaniaLocations.map((item) => ({
    name: item.county,
    code: item.code,
  }));

const citiesByCounty = new Map(
  romaniaLocations.map((item) => [
    item.county,
    item.cities,
  ]),
);

export function getCitiesByCounty(
  county: string,
) {
  return citiesByCounty.get(county) ?? [];
}

export function isValidRomaniaCounty(
  county: string,
) {
  return citiesByCounty.has(county);
}

export function isValidRomaniaLocation(
  county: string,
  city: string,
) {
  return (
    citiesByCounty
      .get(county)
      ?.includes(city) ?? false
  );
}