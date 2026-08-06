import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/virgil-av/judet-oras-localitati-romania/refs/heads/master/judete.json";

const outputPath = path.join(
  process.cwd(),
  "data",
  "romania-locations.json",
);

function normalizeText(value) {
  return value
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("Descarc lista localităților...");

  const response = await fetch(SOURCE_URL);

  if (!response.ok) {
    throw new Error(
      `Descărcarea a eșuat: ${response.status} ${response.statusText}`,
    );
  }

  const source = await response.json();

  if (!Array.isArray(source.judete)) {
    throw new Error(
      "Formatul sursei nu este cel așteptat.",
    );
  }

  const locations = source.judete
    .map((county) => {
      const countyName = normalizeText(
        String(county.nume ?? ""),
      );

      const cities = Array.from(
        new Set(
          (county.localitati ?? [])
            .map((location) =>
              normalizeText(
                String(location.nume ?? ""),
              ),
            )
            .filter(Boolean),
        ),
      ).sort((first, second) =>
        first.localeCompare(second, "ro"),
      );

      return {
        county: countyName,
        code: String(county.auto ?? ""),
        cities,
      };
    })
    .filter(
      (county) =>
        county.county &&
        county.cities.length > 0,
    )
    .sort((first, second) =>
      first.county.localeCompare(
        second.county,
        "ro",
      ),
    );

  await mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await writeFile(
    outputPath,
    JSON.stringify(locations),
    "utf8",
  );

  const cityCount = locations.reduce(
    (total, county) =>
      total + county.cities.length,
    0,
  );

  console.log(
    `Generate: ${locations.length} județe și ${cityCount} localități.`,
  );

  console.log(`Fișier: ${outputPath}`);
}

main().catch((error) => {
  console.error(
    "Generarea localităților a eșuat:",
    error,
  );

  process.exitCode = 1;
});