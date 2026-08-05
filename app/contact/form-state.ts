export type ContactFormErrors = {
  name?: string[];
  email?: string[];
  phone?: string[];
  subject?: string[];
  message?: string[];
};

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: ContactFormErrors;
};

export const initialContactFormState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
};