"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  PackageCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useState,
} from "react";

import {
  getCitiesByCounty,
  romaniaCounties,
} from "@/lib/romania-locations";
import {
  customProjectSchema,
  type CustomProjectInput,
} from "@/lib/validation/custom-project";

const projectTypes = [
  "Hrănitoare pentru animale",
  "Adăpătoare / vălău",
  "Poartă / gard",
  "Balustradă",
  "Structură metalică",
  "Confecție din tablă",
  "Confecție metalică personalizată",
  "Alt proiect",
];

const materials = [
  "Tablă neagră",
  "Tablă zincată",
  "Inox",
  "Oțel",
  "Nu știu / vreau recomandare",
];

const finishes = [
  "Brut",
  "Zincat",
  "Vopsit",
  "Finisat",
  "Nu știu / vreau recomandare",
];

const usages = [
  "Gospodărie",
  "Fermă / zootehnie",
  "Industrial",
  "Exterior",
  "Interior",
  "Altă utilizare",
];

type FormState = {
  projectType: string;
  material: string;
  finish: string;
  usage: string;

  lengthValue: string;
  widthValue: string;
  heightValue: string;
  dimensionUnit:
    | "mm"
    | "cm"
    | "m";

  quantity: string;

  needsRecommendation: boolean;

  customerName: string;
  email: string;
  phone: string;

  company: string;
  vatNumber: string;

  county: string;
  city: string;

  notes: string;
};

const initialFormState: FormState = {
  projectType: "",
  material: "",
  finish: "",
  usage: "",

  lengthValue: "",
  widthValue: "",
  heightValue: "",
  dimensionUnit: "cm",

  quantity: "1",

  needsRecommendation: false,

  customerName: "",
  email: "",
  phone: "",

  company: "",
  vatNumber: "",

  county: "",
  city: "",

  notes: "",
};

type ErrorMap = Partial<
  Record<keyof FormState, string>
>;

export function CustomProjectForm() {
  const router = useRouter();

  const [step, setStep] =
    useState(1);

  const [formData, setFormData] =
    useState<FormState>(
      initialFormState,
    );

  const [errors, setErrors] =
    useState<ErrorMap>({});

  const [submitError, setSubmitError] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const cities = useMemo(
    () =>
      formData.county
        ? getCitiesByCounty(
            formData.county,
          )
        : [],
    [formData.county],
  );

  function updateField<
    K extends keyof FormState,
  >(
    field: K,
    value: FormState[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[field];

      return next;
    });

    setSubmitError("");
  }

  function selectCounty(
    county: string,
  ) {
    setFormData((current) => ({
      ...current,
      county,
      city: "",
    }));

    setErrors((current) => ({
      ...current,
      county: undefined,
      city: undefined,
    }));
  }

  function validateCurrentStep() {
    const nextErrors: ErrorMap = {};

    if (step === 1) {
      if (!formData.projectType) {
        nextErrors.projectType =
          "Selectează tipul proiectului.";
      }
    }

    if (step === 2) {
      if (
        !formData.notes.trim() ||
        formData.notes.trim().length <
          10
      ) {
        nextErrors.notes =
          "Descrie pe scurt proiectul.";
      }
    }

    if (step === 3) {
      if (
        formData.customerName
          .trim()
          .length < 2
      ) {
        nextErrors.customerName =
          "Introdu numele.";
      }

      if (!formData.email.trim()) {
        nextErrors.email =
          "Introdu emailul.";
      }

      if (!formData.phone.trim()) {
        nextErrors.phone =
          "Introdu telefonul.";
      }

      if (!formData.county) {
        nextErrors.county =
          "Selectează județul.";
      }

      if (!formData.city) {
        nextErrors.city =
          "Selectează localitatea.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  }

  function goNext() {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) =>
      Math.min(3, current + 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goBack() {
    setStep((current) =>
      Math.max(1, current - 1),
    );
  }

  async function handleSubmit() {
    if (
      isSubmitting ||
      !validateCurrentStep()
    ) {
      return;
    }

    const requestBody = {
      projectType:
        formData.projectType,

      material: formData.material,

      finish: formData.finish,

      usage: formData.usage,

      lengthValue:
        formData.lengthValue
          ? Number(
              formData.lengthValue,
            )
          : null,

      widthValue:
        formData.widthValue
          ? Number(
              formData.widthValue,
            )
          : null,

      heightValue:
        formData.heightValue
          ? Number(
              formData.heightValue,
            )
          : null,

      dimensionUnit:
        formData.dimensionUnit,

      quantity:
        formData.quantity
          ? Number(
              formData.quantity,
            )
          : null,

      needsRecommendation:
        formData.needsRecommendation,

      customerName:
        formData.customerName,

      email: formData.email,

      phone: formData.phone,

      company: formData.company,

      vatNumber:
        formData.vatNumber,

      county: formData.county,

      city: formData.city,

      notes: formData.notes,
    } satisfies CustomProjectInput;

    const validation =
      customProjectSchema.safeParse(
        requestBody,
      );

    if (!validation.success) {
      const flattened =
        validation.error.flatten()
          .fieldErrors;

      const nextErrors: ErrorMap =
        {};

      for (const [
        key,
        messages,
      ] of Object.entries(
        flattened,
      )) {
        const message =
          messages?.[0];

        if (message) {
          nextErrors[
            key as keyof FormState
          ] = message;
        }
      }

      setErrors(nextErrors);

      setSubmitError(
        "Verifică informațiile introduse.",
      );

      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "/api/custom-projects",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            validation.data,
          ),
        },
      );

      const data =
        (await response.json()) as {
          error?: string;
          request?: {
            requestNumber: string;
          };
        };

      if (
        !response.ok ||
        !data.request
      ) {
        throw new Error(
          data.error ??
            "Cererea nu a putut fi trimisă.",
        );
      }

      router.push(
        `/la-comanda/multumim?requestNumber=${encodeURIComponent(
          data.request
            .requestNumber,
        )}`,
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "A apărut o eroare.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProjectProgress step={step} />

      <section className="mt-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.06)] sm:mt-8 sm:rounded-xl">
        <div className="p-4 sm:p-7 lg:p-9">
          {step === 1 ? (
            <>
              <StepHeading
                eyebrow="Pasul 1"
                title="Ce vrei să realizăm?"
                description="Alege categoria care se apropie cel mai mult de proiectul tău."
              />

              <OptionGrid
                options={
                  projectTypes
                }
                value={
                  formData.projectType
                }
                onChange={(value) =>
                  updateField(
                    "projectType",
                    value,
                  )
                }
              />

              {errors.projectType ? (
                <FieldError
                  message={
                    errors.projectType
                  }
                />
              ) : null}

              <div className="mt-8">
                <FieldLabel>
                  Material
                </FieldLabel>

                <OptionGrid
                  options={materials}
                  value={
                    formData.material
                  }
                  onChange={(value) =>
                    updateField(
                      "material",
                      value,
                    )
                  }
                  compact
                />
              </div>

              <div className="mt-8">
                <FieldLabel>
                  Unde va fi folosit?
                </FieldLabel>

                <OptionGrid
                  options={usages}
                  value={
                    formData.usage
                  }
                  onChange={(value) =>
                    updateField(
                      "usage",
                      value,
                    )
                  }
                  compact
                />
              </div>

              <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl bg-neutral-50 p-4">
                <input
                  type="checkbox"
                  checked={
                    formData.needsRecommendation
                  }
                  onChange={(event) =>
                    updateField(
                      "needsRecommendation",
                      event.target
                        .checked,
                    )
                  }
                  className="mt-1 size-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-semibold text-[#111111]">
                    Am nevoie de o
                    recomandare
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    Nu sunt sigur ce
                    material sau soluție
                    tehnică este potrivită.
                  </span>
                </span>
              </label>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <StepHeading
                eyebrow="Pasul 2"
                title="Detalii tehnice"
                description="Dimensiunile pot fi aproximative. Le putem confirma ulterior împreună."
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <NumberField
                  label="Lungime"
                  value={
                    formData.lengthValue
                  }
                  onChange={(value) =>
                    updateField(
                      "lengthValue",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Lățime"
                  value={
                    formData.widthValue
                  }
                  onChange={(value) =>
                    updateField(
                      "widthValue",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Înălțime"
                  value={
                    formData.heightValue
                  }
                  onChange={(value) =>
                    updateField(
                      "heightValue",
                      value,
                    )
                  }
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>
                    Unitate
                  </FieldLabel>

                  <select
                    value={
                      formData.dimensionUnit
                    }
                    onChange={(event) =>
                      updateField(
                        "dimensionUnit",
                        event.target
                          .value as
                          FormState["dimensionUnit"],
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="mm">
                      Milimetri
                    </option>
                    <option value="cm">
                      Centimetri
                    </option>
                    <option value="m">
                      Metri
                    </option>
                  </select>
                </div>

                <div>
                  <FieldLabel>
                    Cantitate
                  </FieldLabel>

                  <input
                    type="number"
                    min={1}
                    value={
                      formData.quantity
                    }
                    onChange={(event) =>
                      updateField(
                        "quantity",
                        event.target
                          .value,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-neutral-300 px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="mt-8">
                <FieldLabel>
                  Finisaj
                </FieldLabel>

                <OptionGrid
                  options={finishes}
                  value={
                    formData.finish
                  }
                  onChange={(value) =>
                    updateField(
                      "finish",
                      value,
                    )
                  }
                  compact
                />
              </div>

              <div className="mt-8">
                <FieldLabel>
                  Descrie proiectul
                </FieldLabel>

                <textarea
                  value={formData.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value,
                    )
                  }
                  rows={6}
                  maxLength={3000}
                  placeholder="Spune-ne cum vrei să arate produsul, unde îl vei folosi și orice alte detalii importante..."
                  className={[
                    "mt-2 min-h-36 w-full resize-y rounded-xl border bg-white px-4 py-3 text-base outline-none transition focus:ring-2",
                    errors.notes
                      ? "border-red-500 focus:ring-red-500/15"
                      : "border-neutral-300 focus:border-primary focus:ring-primary/15",
                  ].join(" ")}
                />

                <div className="mt-2 flex justify-between gap-4">
                  {errors.notes ? (
                    <FieldError
                      message={
                        errors.notes
                      }
                    />
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-neutral-400">
                    {
                      formData.notes
                        .length
                    }
                    /3000
                  </span>
                </div>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <StepHeading
                eyebrow="Pasul 3"
                title="Unde revenim cu oferta?"
                description="Completează datele de contact pentru a putea discuta detaliile proiectului."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Nume complet"
                  value={
                    formData.customerName
                  }
                  error={
                    errors.customerName
                  }
                  onChange={(value) =>
                    updateField(
                      "customerName",
                      value,
                    )
                  }
                />

                <TextField
                  label="Telefon"
                  value={formData.phone}
                  type="tel"
                  error={errors.phone}
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value,
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <TextField
                    label="Email"
                    value={
                      formData.email
                    }
                    type="email"
                    error={
                      errors.email
                    }
                    onChange={(value) =>
                      updateField(
                        "email",
                        value,
                      )
                    }
                  />
                </div>

                <div>
                  <FieldLabel>
                    Județ
                  </FieldLabel>

                  <select
                    value={
                      formData.county
                    }
                    onChange={(event) =>
                      selectCounty(
                        event.target
                          .value,
                      )
                    }
                    className={[
                      "mt-2 h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:ring-2",
                      errors.county
                        ? "border-red-500 focus:ring-red-500/15"
                        : "border-neutral-300 focus:border-primary focus:ring-primary/15",
                    ].join(" ")}
                  >
                    <option value="">
                      Selectează județul
                    </option>

                    {romaniaCounties.map(
                      (county) => (
                        <option
                          key={
                            county.code
                          }
                          value={
                            county.name
                          }
                        >
                          {
                            county.name
                          }
                        </option>
                      ),
                    )}
                  </select>

                  {errors.county ? (
                    <FieldError
                      message={
                        errors.county
                      }
                    />
                  ) : null}
                </div>

                <div>
                  <FieldLabel>
                    Localitate
                  </FieldLabel>

                  <select
                    value={formData.city}
                    disabled={
                      !formData.county
                    }
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value,
                      )
                    }
                    className={[
                      "mt-2 h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:ring-2 disabled:bg-neutral-100",
                      errors.city
                        ? "border-red-500 focus:ring-red-500/15"
                        : "border-neutral-300 focus:border-primary focus:ring-primary/15",
                    ].join(" ")}
                  >
                    <option value="">
                      {formData.county
                        ? "Selectează localitatea"
                        : "Alege județul"}
                    </option>

                    {cities.map(
                      (city) => (
                        <option
                          key={city}
                          value={city}
                        >
                          {city}
                        </option>
                      ),
                    )}
                  </select>

                  {errors.city ? (
                    <FieldError
                      message={
                        errors.city
                      }
                    />
                  ) : null}
                </div>
              </div>

              <details className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50">
                <summary className="cursor-pointer px-4 py-4 text-sm font-semibold text-[#111111]">
                  Date firmă — opțional
                </summary>

                <div className="grid gap-4 border-t border-neutral-200 p-4 sm:grid-cols-2">
                  <TextField
                    label="Denumire firmă"
                    value={
                      formData.company
                    }
                    onChange={(value) =>
                      updateField(
                        "company",
                        value,
                      )
                    }
                  />

                  <TextField
                    label="CUI / CIF"
                    value={
                      formData.vatNumber
                    }
                    onChange={(value) =>
                      updateField(
                        "vatNumber",
                        value.toUpperCase(),
                      )
                    }
                  />
                </div>
              </details>

              <div className="mt-7 rounded-2xl bg-[#111111] p-4 text-white sm:p-5">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Rezumat
                </p>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <SummaryItem
                    label="Proiect"
                    value={
                      formData.projectType
                    }
                  />

                  <SummaryItem
                    label="Material"
                    value={
                      formData.material ||
                      "De stabilit"
                    }
                  />

                  <SummaryItem
                    label="Cantitate"
                    value={
                      formData.quantity ||
                      "De stabilit"
                    }
                  />

                  <SummaryItem
                    label="Locație"
                    value={`${formData.city || "-"}, ${formData.county || "-"}`}
                  />
                </div>
              </div>

              {submitError ? (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submitError}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <footer
          className="flex items-center gap-3 border-t border-neutral-200 bg-neutral-50 p-4 sm:p-5"
          style={{
            paddingBottom:
              "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="font-condensed flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-bold uppercase tracking-[0.07em] text-[#111111] transition active:scale-[0.98]"
            >
              <ArrowLeft className="size-4" />
              Înapoi
            </button>
          ) : null}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="font-condensed ml-auto flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] sm:flex-none"
            >
              Continuă
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="font-condensed ml-auto flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition active:scale-[0.98] disabled:opacity-60 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" />
                  Se trimite...
                </>
              ) : (
                <>
                  <PackageCheck className="size-5" />
                  Trimite cererea
                </>
              )}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

function ProjectProgress({
  step,
}: {
  step: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        "Proiect",
        "Detalii",
        "Contact",
      ].map((label, index) => {
        const number = index + 1;

        const active =
          number <= step;

        return (
          <div
            key={label}
            className="min-w-0"
          >
            <div
              className={[
                "h-1 rounded-full transition",
                active
                  ? "bg-primary"
                  : "bg-neutral-300",
              ].join(" ")}
            />

            <p
              className={[
                "font-condensed mt-2 truncate text-[10px] font-bold uppercase tracking-[0.08em]",
                active
                  ? "text-[#111111]"
                  : "text-neutral-400",
              ].join(" ")}
            >
              0{number} {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-7">
      <p className="font-condensed text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>

      <h2 className="font-display mt-2 text-4xl uppercase leading-none text-[#111111] sm:text-5xl">
        {title}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
        {description}
      </p>
    </header>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
  compact = false,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "grid gap-2",
        compact
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2",
      ].join(" ")}
    >
      {options.map((option) => {
        const active =
          value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() =>
              onChange(option)
            }
            className={[
              "flex min-h-13 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition active:scale-[0.99]",
              active
                ? "border-primary bg-primary/[0.06] text-[#111111]"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
            ].join(" ")}
          >
            <span>{option}</span>

            {active ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-3.5" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="font-condensed text-xs font-bold uppercase tracking-[0.09em] text-[#111111]">
      {children}
    </p>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder="—"
        className="mt-2 h-12 w-full rounded-xl border border-neutral-300 px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={[
          "mt-2 h-12 w-full rounded-xl border px-4 text-base outline-none focus:ring-2",
          error
            ? "border-red-500 focus:ring-red-500/15"
            : "border-neutral-300 focus:border-primary focus:ring-primary/15",
        ].join(" ")}
      />

      {error ? (
        <FieldError message={error} />
      ) : null}
    </div>
  );
}

function FieldError({
  message,
}: {
  message: string;
}) {
  return (
    <p className="mt-2 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}