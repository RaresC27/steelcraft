import {
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const sourcePath = path.join(
  process.cwd(),
  "data",
  "romania-locations-source.json",
);

const outputPath = path.join(
  process.cwd(),
  "data",
  "romania-locations.json",
);

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const rawContent = await readFile(
    sourcePath,
    "utf8",
  );

  const source = JSON.parse(
    rawContent.replace(/^\uFEFF/, ""),
  );

  if (!Array.isArray(source.judete)) {
    throw new Error(
      'Fișierul sursă nu conține proprietatea "judete".',
    );
  }

  const locations = source.judete
    .map((county) => {
      const countyName = normalizeText(
        county.nume,
      );

      const cities = Array.from(
        new Set(
          (county.localitati ?? [])
            .map((location) =>
              normalizeText(location.nume),
            )
            .filter(Boolean),
        ),
      ).sort((first, second) =>
        first.localeCompare(second, "ro", {
          sensitivity: "base",
        }),
      );

      return {
        county: countyName,
        code: normalizeText(county.auto),
        cities,
      };
    })
    .filter(
      (county) =>
        county.county.length > 0 &&
        county.cities.length > 0,
    )
    .sort((first, second) =>
      first.county.localeCompare(
        second.county,
        "ro",
        {
          sensitivity: "base",
        },
      ),
    );

  await writeFile(
    outputPath,
    JSON.stringify(locations),
    "utf8",
  );

  const localityCount = locations.reduce(
    (total, county) =>
      total + county.cities.length,
    0,
  );

  console.log(
    `Fișier generat: ${locations.length} județe, ${localityCount} localități.`,
  );

  console.log(outputPath);
}

main().catch((error) => {
  console.error(
    "Pregătirea localităților a eșuat:",
    error,
  );

  process.exitCode = 1;
});