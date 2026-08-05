import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-condensed mb-2 block text-sm font-bold uppercase tracking-[0.1em] text-[#111111]"
      >
        {label}

        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-primary"
          >
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

type FormInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
  };

export function FormInput({
  className,
  hasError = false,
  ...props
}: FormInputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-sm border bg-white px-4 text-sm text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
        hasError
          ? "border-red-500"
          : "border-neutral-300",
        className,
      )}
      {...props}
    />
  );
}

type FormTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    hasError?: boolean;
  };

export function FormTextarea({
  className,
  hasError = false,
  ...props
}: FormTextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full resize-y rounded-sm border bg-white px-4 py-3 text-sm leading-6 text-[#111111] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
        hasError
          ? "border-red-500"
          : "border-neutral-300",
        className,
      )}
      {...props}
    />
  );
}