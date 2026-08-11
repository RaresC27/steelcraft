"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  LoaderCircle,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCartStore } from "@/app/stores/cart-store";
import {
  calculateShippingCost,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/commerce/shipping";
import {
  getCitiesByCounty,
  isValidRomaniaCounty,
  isValidRomaniaLocation,
  romaniaCounties,
} from "@/lib/romania-locations";
import { checkoutSchema } from "@/lib/validation/checkout";

type PaymentMethod = "CASH_ON_DELIVERY" | "CARD";

type CheckoutFormData = {
  customerName: string;
  email: string;
  phone: string;
  company: string;
  vatNumber: string;
  county: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

type CheckoutFieldName = keyof CheckoutFormData;

type CheckoutFieldErrors = Partial<Record<CheckoutFieldName, string>>;

type CreateOrderResponse = {
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  order?: {
    id: number;
    orderNumber: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
  };
};

type LocationPickerType = "county" | "city";

type CartItems = ReturnType<typeof useCartStore.getState>["items"];

const initialFormData: CheckoutFormData = {
  customerName: "",
  email: "",
  phone: "",
  company: "",
  vatNumber: "",
  county: "",
  city: "",
  address: "",
  postalCode: "",
  notes: "",
  paymentMethod: "CASH_ON_DELIVERY",
};

const CHECKOUT_DRAFT_KEY = "steelcraft-checkout-draft-v1";

const CHECKOUT_DRAFT_TTL = 7 * 24 * 60 * 60 * 1000;

const CHECKOUT_DRAFT_SAVE_DELAY = 400;

type CheckoutDraft = {
  version: 1;
  savedAt: number;
  data: Partial<CheckoutFormData>;
};

const inputBaseClassName =
  "h-12 w-full rounded-xl border bg-white px-4 text-base text-[#111111] outline-none transition placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 sm:rounded-sm";

const textareaBaseClassName =
  "min-h-28 w-full resize-y rounded-xl border bg-white px-4 py-3 text-base text-[#111111] outline-none transition placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 sm:min-h-32 sm:rounded-sm";

const idleBorderClassName =
  "border-neutral-300 focus:border-primary focus:ring-primary/15";

const errorBorderClassName =
  "border-red-500 focus:border-red-500 focus:ring-red-500/15";

// Class strings are built once instead of on every render.
const inputClassNameIdle = [inputBaseClassName, idleBorderClassName].join(" ");
const inputClassNameError = [inputBaseClassName, errorBorderClassName].join(" ");
const textareaClassNameIdle = [textareaBaseClassName, idleBorderClassName].join(" ");
const textareaClassNameError = [textareaBaseClassName, errorBorderClassName].join(" ");

function getInputClassName(hasError: boolean) {
  return hasError ? inputClassNameError : inputClassNameIdle;
}

function getTextareaClassName(hasError: boolean) {
  return hasError ? textareaClassNameError : textareaClassNameIdle;
}

// A single shared formatter instead of constructing a new Intl.NumberFormat
// on every formatPrice() call (this fires many times per render).
const priceFormatter = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "RON",
  minimumFractionDigits: 2,
});

function formatPrice(value: number) {
  return priceFormatter.format(value);
}

function normalizeFieldErrors(
  source: Record<string, string[] | undefined>,
) {
  const errors: CheckoutFieldErrors = {};

  for (const [field, messages] of Object.entries(source)) {
    const firstMessage = messages?.[0];

    if (!firstMessage) {
      continue;
    }

    if (field in initialFormData) {
      errors[field as CheckoutFieldName] = firstMessage;
    }
  }

  return errors;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type NormalizedOption = {
  label: string;
  normalized: string;
};

function toNormalizedOptions(labels: string[]): NormalizedOption[] {
  return labels.map((label) => ({
    label,
    normalized: normalizeSearchValue(label),
  }));
}

// County list never changes, so it's normalized exactly once at module load
// instead of on every keystroke inside the picker.
const normalizedCounties = toNormalizedOptions(
  romaniaCounties.map((county) => county.name),
);

function clearCheckoutDraft() {
  try {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  } catch {
    // Checkout-ul trebuie să funcționeze și când storage-ul este indisponibil.
  }
}

function readCheckoutDraft(): Partial<CheckoutFormData> | null {
  try {
    const rawDraft = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);

    if (!rawDraft) {
      return null;
    }

    const parsedDraft = JSON.parse(rawDraft) as CheckoutDraft;

    if (
      parsedDraft.version !== 1 ||
      typeof parsedDraft.savedAt !== "number" ||
      !parsedDraft.data
    ) {
      clearCheckoutDraft();
      return null;
    }

    if (Date.now() - parsedDraft.savedAt > CHECKOUT_DRAFT_TTL) {
      clearCheckoutDraft();
      return null;
    }

    const restoredData: Partial<CheckoutFormData> = {
      ...parsedDraft.data,
      paymentMethod: "CASH_ON_DELIVERY",
    };

    if (
      restoredData.county &&
      !isValidRomaniaCounty(restoredData.county)
    ) {
      restoredData.county = "";
      restoredData.city = "";
    }

    if (
      restoredData.county &&
      restoredData.city &&
      !isValidRomaniaLocation(restoredData.county, restoredData.city)
    ) {
      restoredData.city = "";
    }

    return restoredData;
  } catch {
    clearCheckoutDraft();
    return null;
  }
}

function hasMeaningfulCheckoutData(data: CheckoutFormData) {
  return Boolean(
    data.customerName.trim() ||
      data.email.trim() ||
      data.phone.trim() ||
      data.company.trim() ||
      data.vatNumber.trim() ||
      data.county.trim() ||
      data.city.trim() ||
      data.address.trim() ||
      data.postalCode.trim(),
  );
}

/**
 * Tracks the actual visible viewport height via the VisualViewport API.
 * This is the only reliable cross-browser way to know how much space is
 * left once the on-screen keyboard opens (svh/dvh alone are not enough on
 * iOS/Android when the keyboard appears), so the location picker can keep
 * its results list fully visible above the keyboard instead of pushing it
 * out of view.
 */
function useVisualViewportHeight() {
  const [height, setHeight] = useState<number | null>(() =>
    typeof window !== "undefined" && window.visualViewport
      ? window.visualViewport.height
      : null,
  );

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    function updateHeight() {
      setHeight(viewport!.height);
    }

    updateHeight();

    viewport.addEventListener("resize", updateHeight);

    return () => {
      viewport.removeEventListener("resize", updateHeight);
    };
  }, []);

  return height;
}

export function CheckoutForm() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const submitLockRef = useRef(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [activeLocationPicker, setActiveLocationPicker] =
    useState<LocationPickerType | null>(null);
  const [locationSearch, setLocationSearch] = useState("");

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  useEffect(() => {
    const savedDraft = readCheckoutDraft();

    if (savedDraft) {
      setFormData((currentData) => ({
        ...currentData,
        ...savedDraft,
      }));
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isSubmitting) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (!hasMeaningfulCheckoutData(formData)) {
        clearCheckoutDraft();
        return;
      }

      const draft: CheckoutDraft = {
        version: 1,
        savedAt: Date.now(),
        data: {
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          vatNumber: formData.vatNumber,
          county: formData.county,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          paymentMethod: "CASH_ON_DELIVERY",
        },
      };

      try {
        window.localStorage.setItem(
          CHECKOUT_DRAFT_KEY,
          JSON.stringify(draft),
        );
      } catch {
        // Nu blocăm checkout-ul dacă localStorage nu poate fi folosit.
      }
    }, CHECKOUT_DRAFT_SAVE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formData, isMounted, isSubmitting]);

  useEffect(() => {
    if (!activeLocationPicker) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLocationPicker();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocationPicker]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  }, [items]);

  const shippingCost = useMemo(() => calculateShippingCost(subtotal), [subtotal]);
  const total = subtotal + shippingCost;

  const availableCities = useMemo(
    () => (formData.county ? getCitiesByCounty(formData.county) : []),
    [formData.county],
  );

  // Cities are re-normalized only when the county (and thus the city list)
  // actually changes, not on every keystroke in the search box.
  const normalizedCities = useMemo(
    () => toNormalizedOptions(availableCities),
    [availableCities],
  );

  // useDeferredValue keeps typing snappy even for counties with long city
  // lists, by letting the filtered result lag a frame behind the input.
  const deferredLocationSearch = useDeferredValue(locationSearch);

  const pickerOptions = useMemo(() => {
    const source =
      activeLocationPicker === "county" ? normalizedCounties : normalizedCities;

    const normalizedSearch = normalizeSearchValue(deferredLocationSearch);

    if (!normalizedSearch) {
      return source.map((option) => option.label);
    }

    return source
      .filter((option) => option.normalized.includes(normalizedSearch))
      .map((option) => option.label);
  }, [activeLocationPicker, normalizedCities, deferredLocationSearch]);

  const updateField = useCallback(
    (field: CheckoutFieldName, value: string) => {
      setFormData((currentData) => ({
        ...currentData,
        [field]: value,
      }));

      setFieldErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });

      setError((currentError) => (currentError ? "" : currentError));
    },
    [],
  );

  const openLocationPicker = useCallback(
    (type: LocationPickerType) => {
      if (type === "city" && !formData.county) {
        setFieldErrors((currentErrors) => ({
          ...currentErrors,
          county: "Selectează mai întâi județul.",
        }));

        return;
      }

      setLocationSearch("");
      setActiveLocationPicker(type);
    },
    [formData.county],
  );

  const closeLocationPicker = useCallback(() => {
    setActiveLocationPicker(null);
    setLocationSearch("");
  }, []);

  const selectLocation = useCallback(
    (value: string) => {
      if (activeLocationPicker === "county") {
        updateField("county", value);
        updateField("city", "");
      }

      if (activeLocationPicker === "city") {
        updateField("city", value);
      }

      closeLocationPicker();
    },
    [activeLocationPicker, updateField, closeLocationPicker],
  );

  const focusFirstInvalidField = useCallback(
    (errors: CheckoutFieldErrors) => {
      const firstInvalidField = Object.keys(errors)[0] as
        | CheckoutFieldName
        | undefined;

      if (!firstInvalidField) {
        return;
      }

      window.requestAnimationFrame(() => {
        const fieldElement = formRef.current?.querySelector<HTMLElement>(
          `[data-checkout-field="${firstInvalidField}"]`,
        );

        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldElement.focus();
          return;
        }

        const element = formRef.current?.elements.namedItem(firstInvalidField);

        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        ) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting || submitLockRef.current) {
        return;
      }

      if (items.length === 0) {
        setError("Coșul de cumpărături este gol.");
        return;
      }

      const requestBody = {
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const clientValidation = checkoutSchema.safeParse(requestBody);

      if (!clientValidation.success) {
        const errors = normalizeFieldErrors(
          clientValidation.error.flatten().fieldErrors,
        );

        setFieldErrors(errors);
        setError("Verifică informațiile marcate în formular.");
        focusFirstInvalidField(errors);
        return;
      }

      setError("");
      setFieldErrors({});
      setIsSubmitting(true);
      submitLockRef.current = true;

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientValidation.data),
        });

        const data = (await response.json()) as CreateOrderResponse;

        if (!response.ok) {
          if (data.fieldErrors) {
            const errors = normalizeFieldErrors(data.fieldErrors);
            setFieldErrors(errors);
            focusFirstInvalidField(errors);
          }

          throw new Error(data.error ?? "Comanda nu a putut fi trimisă.");
        }

        if (!data.order) {
          throw new Error("Serverul nu a returnat informațiile comenzii.");
        }

        clearCheckoutDraft();
        clearCart();

        router.push(
          `/comanda-finalizata?orderNumber=${encodeURIComponent(
            data.order.orderNumber,
          )}`,
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "A apărut o eroare neașteptată.",
        );

        submitLockRef.current = false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, items, formData, clearCart, router, focusFirstInvalidField],
  );

  if (!isMounted) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:rounded-sm sm:p-8">
        <div className="flex items-center gap-3">
          <LoaderCircle className="size-5 animate-spin text-primary" />
          <p className="text-sm text-neutral-600">Se încarcă datele coșului...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white px-5 py-12 text-center shadow-sm sm:rounded-sm sm:px-8 sm:py-14">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <ShoppingBag className="size-6" />
        </span>

        <h2 className="font-display mt-5 text-3xl uppercase leading-none text-[#111111] sm:text-4xl">
          Coșul este gol
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-600">
          Adaugă cel puțin un produs în coș înainte de a continua către
          finalizarea comenzii.
        </p>

        <Link
          href="/produse"
          className="font-condensed mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-bold uppercase tracking-[0.08em] text-white transition active:scale-[0.98] hover:opacity-90 sm:rounded-sm"
        >
          Vezi produsele
        </Link>
      </section>
    );
  }

  return (
    <>
      <form
        id="checkout-form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="grid items-start gap-5 pb-28 sm:gap-8 sm:pb-0 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <div className="space-y-4 sm:space-y-6">
          <CheckoutSection
            step="01"
            title="Date de contact"
            description="Datele folosite pentru confirmarea comenzii."
          >
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <FormField
                id="customerName"
                label="Nume complet"
                required
                error={fieldErrors.customerName}
              >
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  autoComplete="name"
                  disabled={isSubmitting}
                  value={formData.customerName}
                  onChange={(event) =>
                    updateField("customerName", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.customerName)}
                  aria-describedby={
                    fieldErrors.customerName ? "customerName-error" : undefined
                  }
                  className={getInputClassName(Boolean(fieldErrors.customerName))}
                />
              </FormField>

              <FormField id="phone" label="Telefon" required error={fieldErrors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  placeholder="07xx xxx xxx"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  className={getInputClassName(Boolean(fieldErrors.phone))}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField id="email" label="Email" required error={fieldErrors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    placeholder="nume@exemplu.ro"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    className={getInputClassName(Boolean(fieldErrors.email))}
                  />
                </FormField>
              </div>
            </div>
          </CheckoutSection>

          <details className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-sm">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-7">
              <div>
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Opțional
                </p>

                <h2 className="font-display mt-1 text-2xl uppercase leading-none text-[#111111] sm:text-3xl">
                  Date firmă
                </h2>
              </div>

              <ChevronDown className="size-5 shrink-0 text-neutral-500 transition group-open:rotate-180" />
            </summary>

            <div className="border-t border-neutral-200 px-4 pb-5 pt-4 sm:px-7 sm:pb-7">
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <FormField id="company" label="Denumire firmă" error={fieldErrors.company}>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    disabled={isSubmitting}
                    value={formData.company}
                    onChange={(event) => updateField("company", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={fieldErrors.company ? "company-error" : undefined}
                    className={getInputClassName(Boolean(fieldErrors.company))}
                  />
                </FormField>

                <FormField id="vatNumber" label="CUI / CIF" error={fieldErrors.vatNumber}>
                  <input
                    id="vatNumber"
                    name="vatNumber"
                    type="text"
                    autoCapitalize="characters"
                    disabled={isSubmitting}
                    placeholder="RO12345678"
                    value={formData.vatNumber}
                    onChange={(event) =>
                      updateField("vatNumber", event.target.value.toUpperCase())
                    }
                    aria-invalid={Boolean(fieldErrors.vatNumber)}
                    aria-describedby={
                      fieldErrors.vatNumber ? "vatNumber-error" : undefined
                    }
                    className={getInputClassName(Boolean(fieldErrors.vatNumber))}
                  />
                </FormField>
              </div>
            </div>
          </details>

          <CheckoutSection
            step="02"
            title="Adresa de livrare"
            description="Selectează județul și caută rapid localitatea."
          >
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <SearchableLocationField
                id="county"
                label="Județ"
                required
                value={formData.county}
                placeholder="Selectează județul"
                error={fieldErrors.county}
                disabled={isSubmitting}
                onOpen={openLocationPicker}
              />

              <SearchableLocationField
                id="city"
                label="Localitate"
                required
                value={formData.city}
                placeholder={
                  formData.county ? "Selectează localitatea" : "Alege mai întâi județul"
                }
                error={fieldErrors.city}
                disabled={isSubmitting || !formData.county}
                onOpen={openLocationPicker}
              />

              <input type="hidden" name="county" value={formData.county} />
              <input type="hidden" name="city" value={formData.city} />

              <div className="sm:col-span-2">
                <FormField id="address" label="Adresă" required error={fieldErrors.address}>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    disabled={isSubmitting}
                    placeholder="Stradă, număr, bloc, scară, apartament"
                    value={formData.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.address)}
                    aria-describedby={fieldErrors.address ? "address-error" : undefined}
                    className={getInputClassName(Boolean(fieldErrors.address))}
                  />
                </FormField>
              </div>

              <FormField id="postalCode" label="Cod poștal" error={fieldErrors.postalCode}>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  disabled={isSubmitting}
                  maxLength={6}
                  placeholder="123456"
                  value={formData.postalCode}
                  onChange={(event) =>
                    updateField("postalCode", event.target.value.replace(/\D/g, ""))
                  }
                  aria-invalid={Boolean(fieldErrors.postalCode)}
                  aria-describedby={
                    fieldErrors.postalCode ? "postalCode-error" : undefined
                  }
                  className={getInputClassName(Boolean(fieldErrors.postalCode))}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField id="notes" label="Observații" error={fieldErrors.notes}>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    maxLength={1000}
                    disabled={isSubmitting}
                    placeholder="Detalii despre livrare sau alte observații"
                    value={formData.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.notes)}
                    aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
                    className={getTextareaClassName(Boolean(fieldErrors.notes))}
                  />

                  <p className="text-right text-xs text-neutral-400">
                    {formData.notes.length}/1000
                  </p>
                </FormField>
              </div>
            </div>
          </CheckoutSection>

          <CheckoutSection step="03" title="Metoda de plată">
            <div className="space-y-3">
              <label
                className={[
                  "flex min-h-20 cursor-pointer items-start gap-4 rounded-xl border p-4 transition active:scale-[0.99] sm:rounded-sm",
                  formData.paymentMethod === "CASH_ON_DELIVERY"
                    ? "border-primary bg-primary/[0.04]"
                    : "border-neutral-200 hover:border-neutral-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  disabled={isSubmitting}
                  checked={formData.paymentMethod === "CASH_ON_DELIVERY"}
                  onChange={() => updateField("paymentMethod", "CASH_ON_DELIVERY")}
                  className="mt-1 size-4 accent-primary"
                />

                <span className="flex-1">
                  <span className="font-condensed block text-base font-bold uppercase tracking-[0.05em] text-[#111111]">
                    Ramburs la livrare
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-neutral-600">
                    Plătești când primești comanda.
                  </span>
                </span>

                {formData.paymentMethod === "CASH_ON_DELIVERY" ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-4" />
                  </span>
                ) : null}
              </label>

              <div className="flex min-h-20 cursor-not-allowed items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-100 p-4 opacity-60 sm:rounded-sm">
                <input type="radio" name="paymentMethod" value="CARD" disabled className="mt-1 size-4" />

                <span>
                  <span className="font-condensed block text-base font-bold uppercase tracking-[0.05em] text-[#111111]">
                    Plată cu cardul
                  </span>

                  <span className="mt-1 block text-sm text-neutral-500">
                    Disponibilă în curând.
                  </span>
                </span>
              </div>

              {fieldErrors.paymentMethod ? (
                <p id="paymentMethod-error" role="alert" className="text-sm text-red-600">
                  {fieldErrors.paymentMethod}
                </p>
              ) : null}
            </div>
          </CheckoutSection>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <CheckoutTrustItem icon={ShieldCheck} label="Date protejate" />
            <CheckoutTrustItem icon={PackageCheck} label="Stoc verificat" />
            <CheckoutTrustItem icon={Truck} label="Livrare calculată" />
          </div>
        </div>

        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            error={error}
            isSubmitting={isSubmitting}
          />
        </aside>

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSummaryOpen((current) => !current)}
            aria-expanded={isMobileSummaryOpen}
            className="flex min-h-16 w-full items-center justify-between gap-4 px-4 text-left"
          >
            <span>
              <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                Rezumat comandă
              </span>

              <span className="mt-1 block font-condensed text-lg font-bold text-[#111111]">
                {items.length} {items.length === 1 ? "produs" : "produse"}
              </span>
            </span>

            <span className="flex items-center gap-3">
              <span className="font-condensed text-xl font-bold text-[#111111]">
                {formatPrice(total)}
              </span>

              <ChevronDown
                className={[
                  "size-5 text-neutral-500 transition",
                  isMobileSummaryOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </span>
          </button>

          {isMobileSummaryOpen ? (
            <div className="border-t border-neutral-200 px-4 pb-5">
              <OrderSummaryContent
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
              />

              {error ? <ErrorMessage message={error} /> : null}
            </div>
          ) : null}
        </section>
      </form>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 pt-3 shadow-[0_-16px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {error ? (
          <p role="alert" className="mx-auto mb-2 max-w-md truncate text-xs font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSummaryOpen(true)}
            className="min-w-0 shrink-0 text-left"
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
              Total
            </span>

            <span className="font-condensed block text-xl font-bold leading-none text-[#111111]">
              {formatPrice(total)}
            </span>
          </button>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="font-condensed flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-5 animate-spin" />
                Se trimite...
              </>
            ) : (
              <>
                <PackageCheck className="size-5" />
                Trimite comanda
              </>
            )}
          </button>
        </div>
      </div>

      {activeLocationPicker ? (
        <LocationPickerDialog
          type={activeLocationPicker}
          search={locationSearch}
          selectedValue={
            activeLocationPicker === "county" ? formData.county : formData.city
          }
          county={formData.county}
          options={pickerOptions}
          onSearchChange={setLocationSearch}
          onSelect={selectLocation}
          onClose={closeLocationPicker}
        />
      ) : null}
    </>
  );
}

type CheckoutSectionProps = {
  step: string;
  title: string;
  description?: string;
  children: ReactNode;
};

const CheckoutSection = memo(function CheckoutSection({
  step,
  title,
  description,
  children,
}: CheckoutSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-sm">
      <header className="flex items-start gap-3 border-b border-neutral-200 px-4 py-4 sm:px-7 sm:py-5">
        <span className="font-condensed flex size-8 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-primary">
          {step}
        </span>

        <div>
          <h2 className="font-display text-2xl uppercase leading-none text-[#111111] sm:text-3xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
          ) : null}
        </div>
      </header>

      <div className="p-4 sm:p-7">{children}</div>
    </section>
  );
});

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

const FormField = memo(function FormField({
  id,
  label,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div data-checkout-field={id} className="space-y-2">
      <label
        htmlFor={id}
        className="font-condensed block text-xs font-bold uppercase tracking-[0.09em] text-[#111111] sm:text-sm"
      >
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

type SearchableLocationFieldProps = {
  id: LocationPickerType;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onOpen: (type: LocationPickerType) => void;
};

const SearchableLocationField = memo(function SearchableLocationField({
  id,
  label,
  value,
  placeholder,
  required = false,
  error,
  disabled = false,
  onOpen,
}: SearchableLocationFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={`${id}-picker`}
        className="font-condensed block text-xs font-bold uppercase tracking-[0.09em] text-[#111111] sm:text-sm"
      >
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>

      <button
        id={`${id}-picker`}
        type="button"
        data-checkout-field={id}
        disabled={disabled}
        onClick={() => onOpen(id)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left text-base outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 sm:rounded-sm",
          error ? errorBorderClassName : idleBorderClassName,
        ].join(" ")}
      >
        <span className={value ? "truncate text-[#111111]" : "truncate text-neutral-400"}>
          {value || placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-neutral-500" />
      </button>

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

type LocationPickerDialogProps = {
  type: LocationPickerType;
  search: string;
  selectedValue: string;
  county: string;
  options: string[];
  onSearchChange: (value: string) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
};

const LocationPickerDialog = memo(function LocationPickerDialog({
  type,
  search,
  selectedValue,
  county,
  options,
  onSearchChange,
  onSelect,
  onClose,
}: LocationPickerDialogProps) {
  // Bound to the real visible viewport so the results list is always fully
  // visible above the mobile keyboard, instead of relying on svh/dvh which
  // several mobile browsers don't shrink correctly when the keyboard opens.
  const viewportHeight = useVisualViewportHeight();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [search, type]);

  const title = type === "county" ? "Selectează județul" : "Selectează localitatea";
  const placeholder = type === "county" ? "Caută județul..." : "Caută localitatea...";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }}
      className="fixed inset-x-0 top-0 z-[100] flex flex-col bg-white sm:bg-black/55 sm:backdrop-blur-sm sm:p-6 sm:items-center sm:justify-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Full-screen on mobile (keyboard-safe), centered card from sm: up */}
      <section className="flex h-full w-full flex-1 flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[720px] sm:max-w-lg sm:flex-none sm:rounded-2xl sm:shadow-2xl">
        <header className="shrink-0 border-b border-neutral-200 px-4 pb-4 pt-3 sm:px-5 sm:pt-5">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Închide"
              className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-[#111111] transition active:scale-90"
            >
              <ChevronLeft className="size-5 sm:hidden" />
              <X className="hidden size-5 sm:block" />
            </button>

            <div className="min-w-0 flex-1 text-center">
              <h2 className="font-display text-2xl uppercase leading-none text-[#111111]">
                {title}
              </h2>

              {type === "city" && county ? (
                <p className="mt-1 truncate text-xs text-neutral-500">Județul {county}</p>
              ) : null}
            </div>

            <div className="size-10" />
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="search"
              autoFocus
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={placeholder}
              className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-11 pr-10 text-base text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            />

            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Șterge căutarea"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </header>

        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-3"
        >
          {options.length > 0 ? (
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = selectedValue === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    className={[
                      "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 text-left text-[15px] transition active:scale-[0.99]",
                      isSelected
                        ? "bg-primary/[0.08] font-semibold text-primary"
                        : "text-[#111111] hover:bg-neutral-100",
                    ].join(" ")}
                  >
                    <span className="min-w-0 truncate">{option}</span>

                    {isSelected ? (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-3.5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
              <MapPin className="size-7 text-neutral-400" />
              <p className="mt-3 font-semibold text-[#111111]">Niciun rezultat</p>
              <p className="mt-1 text-sm text-neutral-500">Încearcă o altă căutare.</p>
            </div>
          )}
        </div>

        <div
          className="shrink-0 border-t border-neutral-200 bg-white"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        />
      </section>
    </div>
  );
});

type OrderSummaryProps = {
  items: CartItems;
  subtotal: number;
  shippingCost: number;
  total: number;
  error: string;
  isSubmitting: boolean;
};

const OrderSummary = memo(function OrderSummary({
  items,
  subtotal,
  shippingCost,
  total,
  error,
  isSubmitting,
}: OrderSummaryProps) {
  return (
    <section className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
      <header className="border-b border-neutral-200 px-6 py-5">
        <p className="font-condensed text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          Verificare finală
        </p>

        <h2 className="font-display mt-1 text-3xl uppercase leading-none text-[#111111]">
          Rezumat comandă
        </h2>
      </header>

      <div className="px-6 pb-6">
        <OrderSummaryContent
          items={items}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
        />

        {error ? <ErrorMessage message={error} /> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-condensed mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 text-base font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-5 animate-spin" />
              Se trimite comanda...
            </>
          ) : (
            <>
              <PackageCheck className="size-5" />
              Trimite comanda
            </>
          )}
        </button>

        <Link
          href="/cos"
          className="font-condensed mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-[#111111] px-6 text-sm font-bold uppercase tracking-[0.08em] text-[#111111] transition hover:bg-[#111111] hover:text-white"
        >
          Înapoi la coș
        </Link>
      </div>
    </section>
  );
});

type OrderSummaryContentProps = {
  items: CartItems;
  subtotal: number;
  shippingCost: number;
  total: number;
};

const OrderSummaryContent = memo(function OrderSummaryContent({
  items,
  subtotal,
  shippingCost,
  total,
}: OrderSummaryContentProps) {
  return (
    <>
      <div className="divide-y divide-neutral-200">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-condensed truncate text-sm font-bold uppercase tracking-[0.04em] text-[#111111]">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">Cantitate: {item.quantity}</p>
            </div>

            <p className="font-condensed shrink-0 text-base font-bold text-[#111111]">
              {formatPrice(Number(item.price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 pt-5">
        <div className="space-y-3">
          <PriceRow label="Subtotal" value={formatPrice(subtotal)} />

          <PriceRow
            label="Livrare"
            value={shippingCost === 0 ? "Gratuită" : formatPrice(shippingCost)}
          />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-neutral-200 pt-5">
          <span className="font-condensed text-base font-bold uppercase tracking-[0.06em] text-[#111111]">
            Total
          </span>

          <span className="font-condensed text-2xl font-bold text-[#111111]">
            {formatPrice(total)}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-neutral-500">
          {shippingCost === 0
            ? "Comanda beneficiază de livrare gratuită."
            : `Livrare gratuită pentru comenzi de minimum ${formatPrice(
                FREE_SHIPPING_THRESHOLD,
              )}.`}
        </p>
      </div>
    </>
  );
});

const ErrorMessage = memo(function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:rounded-sm"
    >
      {message}
    </div>
  );
});

type PriceRowProps = { label: string; value: string };

const PriceRow = memo(function PriceRow({ label, value }: PriceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className="font-condensed text-lg font-bold text-[#111111]">{value}</span>
    </div>
  );
});

type CheckoutTrustItemProps = {
  icon: typeof ShieldCheck;
  label: string;
};

const CheckoutTrustItem = memo(function CheckoutTrustItem({
  icon: Icon,
  label,
}: CheckoutTrustItemProps) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-2 text-center shadow-sm sm:rounded-sm">
      <Icon className="size-5 text-primary" />

      <span className="font-condensed mt-2 text-[9px] font-bold uppercase leading-4 tracking-[0.05em] text-neutral-600 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
});