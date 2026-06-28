import type { RegisterOptions } from "react-hook-form";

export const nameValidation = {
  required: "Name is required.",
} satisfies RegisterOptions;

export const emailValidation = {
  required: "Email is required.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address.",
  },
} satisfies RegisterOptions;

export const passwordValidation = {
  required: "Password is required.",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters.",
  },
} satisfies RegisterOptions;
