"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { submitContactForm } from "@/app/contact/actions";
import { initialContactFormState } from "@/app/contact/form-state";
import { ContactSubmitButton } from "@/components/form/contact-submit-button";
import {
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/form/form-field";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  selectedProduct?: {
    name: string;
    slug: string;
  };
};

export function ContactForm({
  selectedProduct,
}: ContactFormProps) {
  const [state, formAction] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-sm border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10"
    >
      {selectedProduct && (
        <input
          type="hidden"
          name="productSlug"
          value={selectedProduct.slug}
        />
      )}

      <div className="mb-8">
        <p className="font-condensed text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Formular de contact
        </p>

        <h2 className="font-display mt-3 text-5xl uppercase leading-[0.95] text-[#111111]">
          Spune-ne ce ai nevoie
        </h2>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Completează informațiile de mai jos, iar noi te vom
          contacta pentru detalii.
        </p>
      </div>

      {state.message && (
        <div
          role={state.success ? "status" : "alert"}
          className={cn(
            "mb-7 flex items-start gap-3 rounded-sm border px-4 py-4 text-sm leading-6",
            state.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800",
          )}
        >
          {state.success ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
          )}

          <p>{state.message}</p>
        </div>
      )}

      {selectedProduct && (
        <div className="mb-7 rounded-sm border border-primary/25 bg-primary/5 px-5 py-4">
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Produs selectat
          </p>

          <p className="mt-1 font-semibold text-[#111111]">
            {selectedProduct.name}
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Nume"
          htmlFor="name"
          required
          error={state.errors?.name?.[0]}
        >
          <FormInput
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Numele tău"
            required
            hasError={Boolean(state.errors?.name)}
          />
        </FormField>

        <FormField
          label="Telefon"
          htmlFor="phone"
          error={state.errors?.phone?.[0]}
        >
          <FormInput
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+40 700 000 000"
            hasError={Boolean(state.errors?.phone)}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          required
          error={state.errors?.email?.[0]}
        >
          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nume@exemplu.ro"
            required
            hasError={Boolean(state.errors?.email)}
          />
        </FormField>

        <FormField
          label="Subiect"
          htmlFor="subject"
          required
          error={state.errors?.subject?.[0]}
        >
          <FormInput
            id="subject"
            name="subject"
            type="text"
            defaultValue={
              selectedProduct
                ? `Ofertă pentru ${selectedProduct.name}`
                : ""
            }
            placeholder="Despre ce dorești să discutăm?"
            required
            hasError={Boolean(state.errors?.subject)}
          />
        </FormField>
      </div>

      <div className="mt-6">
        <FormField
          label="Mesaj"
          htmlFor="message"
          required
          error={state.errors?.message?.[0]}
        >
          <FormTextarea
            id="message"
            name="message"
            placeholder={
              selectedProduct
                ? "Spune-ne ce dimensiuni, cantitate sau modificări dorești..."
                : "Descrie produsul sau proiectul pentru care dorești o ofertă..."
            }
            required
            hasError={Boolean(state.errors?.message)}
          />
        </FormField>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-neutral-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-neutral-500">
          Prin trimiterea formularului confirmi că informațiile
          introduse pot fi folosite pentru a răspunde solicitării.
        </p>

        <ContactSubmitButton />
      </div>
    </form>
  );
}