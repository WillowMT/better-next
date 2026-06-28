import { describe, expect, test } from "bun:test";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from "@/components/auth/auth-form-validation";

describe("auth form validation rules", () => {
  test("requires a display name for sign up", () => {
    expect(nameValidation.required).toBe("Name is required.");
  });

  test("validates email format", () => {
    expect(emailValidation.required).toBe("Email is required.");
    expect(emailValidation.pattern?.value.test("person@example.com")).toBe(true);
    expect(emailValidation.pattern?.value.test("not-an-email")).toBe(false);
    expect(emailValidation.pattern?.message).toBe("Enter a valid email address.");
  });

  test("requires an eight character password", () => {
    expect(passwordValidation.required).toBe("Password is required.");
    expect(passwordValidation.minLength).toEqual({
      value: 8,
      message: "Password must be at least 8 characters.",
    });
  });
});
