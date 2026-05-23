import { test, expect } from "@playwright/test";

test("landing page carrega", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Comunidade AI/i);
  await expect(page.getByText("Comunidade AI")).toBeVisible();
});

test("login carrega", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await expect(page.getByPlaceholder("Seu e-mail")).toBeVisible();
  await expect(page.getByPlaceholder("Sua senha")).toBeVisible();
});

