"use client";

import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

import {
  getCitiesByCounty,
  romaniaCounties,
} from "@/lib/romania-locations";

type CountyCitySelectProps = {
  county: string;
  city: string;
  countyError?: string;
  cityError?: string;
  disabled?: boolean;
  onCountyChange: (
    value: string,
  ) => void;
  onCityChange: (
    value: string,
  ) => void;
};

const selectBaseClassName =
  "h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-11 text-base text-[#111111] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 sm:rounded-sm";

function getSelectClassName(
  hasError: boolean,
) {
  return [
    selectBaseClassName,
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-neutral-300 focus:border-primary focus:ring-primary/15",
  ].join(" ");
}

export function CountyCitySelect({
  county,
  city,
  countyError,
  cityError,
  disabled = false,
  onCountyChange,
  onCityChange,
}: CountyCitySelectProps) {
  const cities = useMemo(
    () =>
      county
        ? getCitiesByCounty(county)
        : [],
    [county],
  );

  function handleCountyChange(
    nextCounty: string,
  ) {
    onCountyChange(nextCounty);
    onCityChange("");
  }

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="county"
          className="block font-barlow-condensed text-sm font-semibold uppercase tracking-wider text-[#111111]"
        >
          Județ
          <span className="ml-1 text-primary">
            *
          </span>
        </label>

        <div className="relative">
          <select
            id="county"
            name="county"
            autoComplete="address-level1"
            value={county}
            disabled={disabled}
            onChange={(event) =>
              handleCountyChange(
                event.target.value,
              )
            }
            aria-invalid={Boolean(
              countyError,
            )}
            aria-describedby={
              countyError
                ? "county-error"
                : undefined
            }
            className={getSelectClassName(
              Boolean(countyError),
            )}
          >
            <option value="">
              Selectează județul
            </option>

            {romaniaCounties.map(
              (item) => (
                <option
                  key={`${item.code}-${item.name}`}
                  value={item.name}
                >
                  {item.name}
                </option>
              ),
            )}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
          />
        </div>

        {countyError ? (
          <p
            id="county-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {countyError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="city"
          className="block font-barlow-condensed text-sm font-semibold uppercase tracking-wider text-[#111111]"
        >
          Localitate
          <span className="ml-1 text-primary">
            *
          </span>
        </label>

        <div className="relative">
          <select
            id="city"
            name="city"
            autoComplete="address-level2"
            value={city}
            disabled={
              disabled || !county
            }
            onChange={(event) =>
              onCityChange(
                event.target.value,
              )
            }
            aria-invalid={Boolean(cityError)}
            aria-describedby={
              cityError
                ? "city-error"
                : undefined
            }
            className={getSelectClassName(
              Boolean(cityError),
            )}
          >
            <option value="">
              {county
                ? "Selectează localitatea"
                : "Alege mai întâi județul"}
            </option>

            {cities.map((cityName) => (
              <option
                key={cityName}
                value={cityName}
              >
                {cityName}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
          />
        </div>

        {cityError ? (
          <p
            id="city-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {cityError}
          </p>
        ) : null}
      </div>
    </>
  );
}