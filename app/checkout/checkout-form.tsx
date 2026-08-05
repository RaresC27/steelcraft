"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  calculateShippingCost,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/commerce/shipping";
import { checkoutSchema } from "@/lib/validation/checkout";
import { useCartStore } from "@/app/stores/cart-store";

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

type CheckoutFieldErrors = Partial<
  Record<CheckoutFieldName, string>
>;

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

const inputClassName =
  "h-12 w-full rounded-sm border bg-white px-4 font-barlow text-base text-[#111111] outline-none transition placeholder:text-neutral-400 focus:ring-2";

const textareaClassName =
  "min-h-32 w-full resize-y rounded-sm border bg-white px-4 py-3 font-barlow text-base text-[#111111] outline-none transition placeholder:text-neutral-400 focus:ring-2";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
  }).format(value);
}

function getInputClassName(hasError: boolean) {
  return [
    inputClassName,
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-neutral-300 focus:border-[#ff5500] focus:ring-[#ff5500]/15",
  ].join(" ");
}

function getTextareaClassName(hasError: boolean) {
  return [
    textareaClassName,
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-neutral-300 focus:border-[#ff5500] focus:ring-[#ff5500]/15",
  ].join(" ");
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

export function CheckoutForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] =
    useState<CheckoutFormData>(initialFormData);

  const [fieldErrors, setFieldErrors] =
    useState<CheckoutFieldErrors>({});

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + Number(item.price) * item.quantity;
    }, 0);
  }, [items]);

  const shippingCost = useMemo(
    () => calculateShippingCost(subtotal),
    [subtotal],
  );

  const total = subtotal + shippingCost;

  function updateField(
    field: CheckoutFieldName,
    value: string,
  ) {
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

    if (error) {
      setError("");
    }
  }

  function focusFirstInvalidField(
    errors: CheckoutFieldErrors,
  ) {
    const firstInvalidField = Object.keys(
      errors,
    )[0] as CheckoutFieldName | undefined;

    if (!firstInvalidField) {
      return;
    }

    window.requestAnimationFrame(() => {
      const element = formRef.current?.elements.namedItem(
        firstInvalidField,
      );

      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      ) {
        element.focus();
      }
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    const clientValidation =
      checkoutSchema.safeParse(requestBody);

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

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientValidation.data),
      });

      const data =
        (await response.json()) as CreateOrderResponse;

      if (!response.ok) {
        if (data.fieldErrors) {
          const errors = normalizeFieldErrors(
            data.fieldErrors,
          );

          setFieldErrors(errors);
          focusFirstInvalidField(errors);
        }

        throw new Error(
          data.error ?? "Comanda nu a putut fi trimisă.",
        );
      }

      if (!data.order) {
        throw new Error(
          "Serverul nu a returnat informațiile comenzii.",
        );
      }

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
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="rounded-sm border border-neutral-200 bg-white p-8">
        <p className="font-barlow text-neutral-600">
          Se încarcă datele coșului...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-sm border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
        <h2 className="font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
          Coșul este gol
        </h2>

        <p className="mx-auto mt-3 max-w-md font-barlow text-neutral-600">
          Adaugă cel puțin un produs în coș înainte de a continua
          către checkout.
        </p>

        <Link
          href="/produse"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#ff5500] px-7 font-barlow-condensed text-base font-bold uppercase tracking-wider text-white transition hover:bg-[#e64d00]"
        >
          Vezi produsele
        </Link>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]"
    >
      <div className="space-y-6">
        <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            title="Date de contact"
            description="Vom folosi aceste date pentru confirmarea comenzii."
          />

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
                value={formData.customerName}
                onChange={(event) =>
                  updateField(
                    "customerName",
                    event.target.value,
                  )
                }
                aria-invalid={Boolean(
                  fieldErrors.customerName,
                )}
                aria-describedby={
                  fieldErrors.customerName
                    ? "customerName-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.customerName),
                )}
              />
            </FormField>

            <FormField
              id="phone"
              label="Telefon"
              required
              error={fieldErrors.phone}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="07xx xxx xxx"
                value={formData.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={
                  fieldErrors.phone
                    ? "phone-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.phone),
                )}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                id="email"
                label="Email"
                required
                error={fieldErrors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="nume@exemplu.ro"
                  value={formData.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email
                      ? "email-error"
                      : undefined
                  }
                  className={getInputClassName(
                    Boolean(fieldErrors.email),
                  )}
                />
              </FormField>
            </div>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            title="Date firmă"
            description="Câmpurile sunt opționale."
          />

          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <FormField
              id="company"
              label="Denumire firmă"
              error={fieldErrors.company}
            >
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={(event) =>
                  updateField("company", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.company)}
                aria-describedby={
                  fieldErrors.company
                    ? "company-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.company),
                )}
              />
            </FormField>

            <FormField
              id="vatNumber"
              label="CUI / CIF"
              error={fieldErrors.vatNumber}
            >
              <input
                id="vatNumber"
                name="vatNumber"
                type="text"
                autoCapitalize="characters"
                placeholder="RO12345678"
                value={formData.vatNumber}
                onChange={(event) =>
                  updateField(
                    "vatNumber",
                    event.target.value.toUpperCase(),
                  )
                }
                aria-invalid={Boolean(
                  fieldErrors.vatNumber,
                )}
                aria-describedby={
                  fieldErrors.vatNumber
                    ? "vatNumber-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.vatNumber),
                )}
              />
            </FormField>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading title="Adresa de livrare" />

          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <FormField
              id="county"
              label="Județ"
              required
              error={fieldErrors.county}
            >
              <input
                id="county"
                name="county"
                type="text"
                autoComplete="address-level1"
                value={formData.county}
                onChange={(event) =>
                  updateField("county", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.county)}
                aria-describedby={
                  fieldErrors.county
                    ? "county-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.county),
                )}
              />
            </FormField>

            <FormField
              id="city"
              label="Localitate"
              required
              error={fieldErrors.city}
            >
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={formData.city}
                onChange={(event) =>
                  updateField("city", event.target.value)
                }
                aria-invalid={Boolean(fieldErrors.city)}
                aria-describedby={
                  fieldErrors.city
                    ? "city-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.city),
                )}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                id="address"
                label="Adresă"
                required
                error={fieldErrors.address}
              >
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Stradă, număr, bloc, scară, apartament"
                  value={formData.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value,
                    )
                  }
                  aria-invalid={Boolean(
                    fieldErrors.address,
                  )}
                  aria-describedby={
                    fieldErrors.address
                      ? "address-error"
                      : undefined
                  }
                  className={getInputClassName(
                    Boolean(fieldErrors.address),
                  )}
                />
              </FormField>
            </div>

            <FormField
              id="postalCode"
              label="Cod poștal"
              error={fieldErrors.postalCode}
            >
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="123456"
                value={formData.postalCode}
                onChange={(event) =>
                  updateField(
                    "postalCode",
                    event.target.value.replace(/\D/g, ""),
                  )
                }
                aria-invalid={Boolean(
                  fieldErrors.postalCode,
                )}
                aria-describedby={
                  fieldErrors.postalCode
                    ? "postalCode-error"
                    : undefined
                }
                className={getInputClassName(
                  Boolean(fieldErrors.postalCode),
                )}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                id="notes"
                label="Observații"
                error={fieldErrors.notes}
              >
                <textarea
                  id="notes"
                  name="notes"
                  rows={5}
                  maxLength={1000}
                  placeholder="Detalii despre livrare sau alte observații"
                  value={formData.notes}
                  onChange={(event) =>
                    updateField("notes", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.notes)}
                  aria-describedby={
                    fieldErrors.notes
                      ? "notes-error"
                      : undefined
                  }
                  className={getTextareaClassName(
                    Boolean(fieldErrors.notes),
                  )}
                />

                <p className="text-right text-xs text-neutral-400">
                  {formData.notes.length}/1000
                </p>
              </FormField>
            </div>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            title="Metoda de plată"
            description="Selectează cum dorești să achiți comanda."
          />

          <div className="space-y-3">
            <label
              className={[
                "flex cursor-pointer items-start gap-4 rounded-sm border p-4 transition",
                formData.paymentMethod ===
                "CASH_ON_DELIVERY"
                  ? "border-[#ff5500] bg-[#ff5500]/5"
                  : "border-neutral-200 hover:border-neutral-300",
              ].join(" ")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={
                  formData.paymentMethod ===
                  "CASH_ON_DELIVERY"
                }
                onChange={() =>
                  updateField(
                    "paymentMethod",
                    "CASH_ON_DELIVERY",
                  )
                }
                className="mt-1 size-4 accent-[#ff5500]"
              />

              <span>
                <span className="block font-barlow-condensed text-base font-bold uppercase tracking-wide text-[#111111]">
                  Ramburs la livrare
                </span>

                <span className="mt-1 block font-barlow text-sm text-neutral-600">
                  Plătești când primești comanda.
                </span>
              </span>
            </label>

            <label className="flex cursor-not-allowed items-start gap-4 rounded-sm border border-neutral-200 bg-neutral-100 p-4 opacity-60">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                disabled
                className="mt-1 size-4"
              />

              <span>
                <span className="block font-barlow-condensed text-base font-bold uppercase tracking-wide text-[#111111]">
                  Plată cu cardul
                </span>

                <span className="mt-1 block font-barlow text-sm text-neutral-500">
                  Disponibilă în curând.
                </span>
              </span>
            </label>

            {fieldErrors.paymentMethod ? (
              <p
                id="paymentMethod-error"
                role="alert"
                className="text-sm text-red-600"
              >
                {fieldErrors.paymentMethod}
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <section className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="border-b border-neutral-200 pb-4 font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
            Rezumat comandă
          </h2>

          <div className="divide-y divide-neutral-200">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-barlow-condensed text-base font-semibold uppercase tracking-wide text-[#111111]">
                    {item.name}
                  </p>

                  <p className="mt-1 font-barlow text-sm text-neutral-500">
                    Cantitate: {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 font-barlow-condensed text-base font-bold text-[#111111]">
                  {formatPrice(
                    Number(item.price) * item.quantity,
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-5">
            <div className="space-y-3">
              <PriceRow
                label="Subtotal"
                value={formatPrice(subtotal)}
              />

              <PriceRow
                label="Livrare"
                value={
                  shippingCost === 0
                    ? "Gratuită"
                    : formatPrice(shippingCost)
                }
              />
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-neutral-200 pt-5">
              <span className="font-barlow-condensed text-lg font-bold uppercase tracking-wide text-[#111111]">
                Total
              </span>

              <span className="font-barlow-condensed text-2xl font-bold text-[#111111]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-3 font-barlow text-xs leading-relaxed text-neutral-500">
              {shippingCost === 0
                ? "Comanda beneficiază de livrare gratuită."
                : `Livrare gratuită pentru comenzi de minimum ${formatPrice(
                    FREE_SHIPPING_THRESHOLD,
                  )}.`}
            </p>

            <p className="mt-2 font-barlow text-xs leading-relaxed text-neutral-500">
              Prețurile, stocul și totalul final sunt verificate
              din nou pe server înainte de înregistrarea comenzii.
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-5 border border-red-200 bg-red-50 px-4 py-3 font-barlow text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-sm bg-[#ff5500] px-6 font-barlow-condensed text-lg font-bold uppercase tracking-wider text-white transition hover:bg-[#e64d00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Se trimite comanda..."
              : "Trimite comanda"}
          </button>

          <Link
            href="/cos"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-[#111111] px-6 font-barlow-condensed text-base font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            Înapoi la coș
          </Link>
        </section>
      </aside>
    </form>
  );
}

type SectionHeadingProps = {
  title: string;
  description?: string;
};

function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 border-b border-neutral-200 pb-4">
      <h2 className="font-bebas-neue text-3xl uppercase tracking-wide text-[#111111]">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 font-barlow text-sm text-neutral-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

function FormField({
  id,
  label,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-barlow-condensed text-sm font-semibold uppercase tracking-wider text-[#111111]"
      >
        {label}

        {required ? (
          <span className="ml-1 text-[#ff5500]">*</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PriceRowProps = {
  label: string;
  value: string;
};

function PriceRow({
  label,
  value,
}: PriceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-barlow text-neutral-600">
        {label}
      </span>

      <span className="font-barlow-condensed text-lg font-bold text-[#111111]">
        {value}
      </span>
    </div>
  );
}