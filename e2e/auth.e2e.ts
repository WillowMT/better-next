import { expect, test } from "@playwright/test";

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test("redirects protected routes to sign-in with a safe next path", async ({
  page,
}) => {
  await page.goto("/dashboard/settings?tab=profile");

  await expect(page).toHaveURL(
    /\/sign-in\?next=%2Fdashboard%2Fsettings%3Ftab%3Dprofile/,
  );
});

test("signs up, updates profile name, signs out, and signs back in", async ({
  page,
}) => {
  const email = uniqueEmail();
  const password = "Password123!";

  await page.goto("/sign-up");
  await page.getByLabel("Name").fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: "Account settings" }),
  ).toBeVisible();

  await page.getByLabel("Display name").fill("Updated E2E User");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByText("Name updated.")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/");

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Updated E2E User")).toBeVisible();
});
