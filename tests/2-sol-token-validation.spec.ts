import { test, expect, request } from "@playwright/test";

const API_URL =
  "https://wallet-api.solflare.com/v3/portfolio/tokens/HuiTegTpNAU7EJXvn95HKEWBdFMtWZYko4yoFVQyCKUS";
const AUTH_TOKEN = "73866a97-1a4e-4807-8e5e-cf33e150ce2d";

test.describe("SOL Token Validation", () => {
  let tokens: any[];

  test.beforeAll(async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    // GET bez network parametra
    const response = await apiContext.get("");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    tokens = data.tokens;
  });

  test("should return only one token - SOL", () => {
    // Expected Result: The response contains only the SOL token
    const solTokens = tokens.filter(
      (token: { mint: string }) =>
        token.mint === "11111111111111111111111111111111"
    );
    expect(solTokens.length).toBe(1);
  });

  test("SOL token should have essential properties", () => {
    const solToken = tokens[0];

    expect(solToken.name).toBe("Solana");
    expect(solToken.symbol).toBe("SOL");
    expect(solToken.mint).toBe("11111111111111111111111111111111");
    expect(typeof solToken.totalUiAmount).toBe("number");
    expect(solToken.totalUiAmount).toBeGreaterThanOrEqual(0);
  });

  test("price object of SOL token should contain key values", () => {
    const solToken = tokens[0];
    expect(solToken.price).toBeDefined();
    expect(typeof solToken.price.price).toBe("number");
    expect(typeof solToken.price.usdPrice).toBe("number");
    // možeš dodati još provjera ako želiš, npr. promjenu cijene itd.
  });
});
