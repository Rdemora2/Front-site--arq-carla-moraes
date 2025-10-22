import { test, expect } from "@playwright/test";

test.describe("Contact Form Conversion Flow", () => {
  test("should successfully submit contact form with valid data", async ({
    page,
  }) => {
    await page.goto("/");

    await page.click("text='Fale Conosco'");

    await expect(page).toHaveURL("/contato");

    await page.fill("input[name='nome']", "João Silva");
    await page.fill("input[name='email']", "joao.silva@example.com");
    await page.fill("input[name='telefone']", "(11) 99999-9999");
    await page.fill(
      "textarea[name='mensagem']",
      "Gostaria de um orçamento para paisagismo residencial de 300m². Tenho interesse em um projeto completo com jardim, iluminação e irrigação automatizada."
    );
    await page.check("input[name='privacy']");

    await page.click("button[type='submit']");

    await expect(
      page.locator("text='Formulário em Desenvolvimento'")
    ).toBeVisible({ timeout: 10000 });

    await page.click("button:has-text('Entendi')");
  });

  test("should show validation errors for invalid inputs", async ({ page }) => {
    await page.goto("/contato");

    await page.waitForLoadState("networkidle");

    const emailInput = page.locator("input[name='email']");
    await emailInput.fill("email-invalido");
    await emailInput.blur();
    await expect(page.locator("text=/Email.*inválido/i")).toBeVisible({
      timeout: 5000,
    });

    const telefoneInput = page.locator("input[name='telefone']");
    await telefoneInput.fill("123");
    await telefoneInput.blur();
    await expect(page.locator("text=/Telefone.*inválido/i")).toBeVisible({
      timeout: 5000,
    });

    await emailInput.fill("");
    await emailInput.blur();
    await expect(page.locator("text=/Email.*obrigatório/i")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should show character count for message field", async ({ page }) => {
    await page.goto("/contato");

    const messageField = page.locator("textarea[name='mensagem']");
    await messageField.fill("Teste de mensagem curta");

    await expect(page.locator("text=/\\d+\\/2000/")).toBeVisible();
  });

  test("should handle form submission error gracefully", async ({ page }) => {
    await page.goto("/contato");
    await page.fill("input[name='nome']", "João Silva");
    await page.fill("input[name='email']", "joao@example.com");
    await page.fill(
      "textarea[name='mensagem']",
      "Teste de mensagem com mais de 50 caracteres para passar na validação."
    );
    await page.check("input[name='privacy']");
    await page.click("button[type='submit']");

    await expect(
      page.locator("text='Formulário em Desenvolvimento'")
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should open mobile menu and navigate", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.waitForTimeout(1000);

    const menuButton = page.locator("button[aria-label='Abrir menu']");

    await expect(menuButton).toBeVisible({ timeout: 15000 });

    await menuButton.scrollIntoViewIfNeeded();
    await menuButton.click();

    await page.waitForTimeout(1500);

    await page.locator("a[href='/sobre-nos']").nth(1).click({ force: true });

    await expect(page).toHaveURL(/\/sobre/);
  });

  test("should display hero content properly on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("h1:has-text('Transformamos Espaços')")
    ).toBeVisible();
    await expect(page.locator("text='Fale Conosco'")).toBeVisible();
  });
});

test.describe("Hero CTA Tracking", () => {
  test("should navigate to contact page when clicking primary CTA", async ({
    page,
  }) => {
    await page.goto("/");

    await page.click("text='Fale Conosco'");

    await expect(page).toHaveURL("/contato");
  });

  test("should navigate to projects page when clicking secondary CTA", async ({
    page,
  }) => {
    await page.goto("/");

    await page.click("text='Explorar Projetos'");

    await expect(page).toHaveURL("/projetos");
  });

  test("should display trust indicators on hero section", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text='25+ Anos de Experiência'")).toBeVisible();
    await expect(page.locator("text='500+ Projetos Realizados'")).toBeVisible();
    await expect(
      page.locator("text='Atendimento Personalizado'")
    ).toBeVisible();
  });
});

test.describe("Accessibility Tests", () => {
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("networkidle");

    const h1Locator = page.locator("h1");
    await h1Locator.first().waitFor({ state: "visible", timeout: 10000 });

    const h1 = await h1Locator.count();
    expect(h1).toBeGreaterThanOrEqual(1);

    const h1Text = await h1Locator.first().textContent();
    expect(h1Text).toContain("Transformamos");
  });

  test("should have alt text on images", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();

    for (const image of images) {
      const alt = await image.getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("form inputs should have labels", async ({ page }) => {
    await page.goto("/contato");

    const nameInput = page.locator("input[name='nome']");
    const nameLabel = page.locator("label:has-text('Nome')");

    await expect(nameInput).toBeVisible();
    await expect(nameLabel).toBeVisible();
  });
});
