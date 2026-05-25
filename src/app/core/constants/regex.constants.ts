export const REGEX = {
  phoneCm: /^(?:\+?237)?[\s-]?6[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  otp6: /^\d{6}$/,
  amount: /^\d+(?:[\s.,]\d{3})*(?:[.,]\d{1,2})?$/,
} as const;
