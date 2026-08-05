export type CategoryFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialCategoryFormState: CategoryFormState = {
  success: false,
  message: "",
  errors: {},
};