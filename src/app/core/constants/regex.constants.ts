export const REGEX = {
  CAMEROON_PHONE: /^6[0-9]{8}$/,
  CAMEROON_PHONE_FULL: /^\+237[0-9]{9}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  CNI: /^[A-Z0-9]{6,12}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
} as const;
