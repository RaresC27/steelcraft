export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialProductFormState: ProductFormState = {
  success: false,
  message: "",
  errors: {},
};