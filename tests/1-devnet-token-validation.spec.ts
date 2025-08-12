import { test, expect, request } from "@playwright/test";

const API_URL =
  "https://wallet-api.solflare.com/v3/portfolio/tokens/HuiTegTpNAU7EJXvn95HKEWBdFMtWZYko4yoFVQyCKUS";
const AUTH_TOKEN = "73866a97-1a4e-4807-8e5e-cf33e150ce2d";

test.describe("Devnet Token Validation", () => {
  let tokens: any[];

  test.beforeAll(async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    const response = await apiContext.get("", {
      params: { network: "devnet" },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    tokens = data.tokens;
  });

  test("should have multiple tokens", () => {
    expect(tokens.length).toBeGreaterThan(1);
    const hasNonSOLToken = tokens.some(
      (token) => token.mint !== "11111111111111111111111111111111"
    );
    expect(hasNonSOLToken).toBe(true);
  });

  test("each token should have a mint address", () => {
    for (const token of tokens) {
      expect(token.mint).toBeTruthy();
    }
  });

  test("totalUiAmount should be a non-negative number for each token", () => {
    for (const token of tokens) {
      expect(typeof token.totalUiAmount).toBe("number");
      expect(token.totalUiAmount).toBeGreaterThanOrEqual(0);
    }
  });

  test("price and coingeckoId fields should have correct types if present", () => {
    for (const token of tokens) {
      if (token.price !== undefined) {
        expect(typeof token.price).toBe("object");
        expect(token.price).toHaveProperty("price");
        expect(typeof token.price.price).toBe("number");
        expect(token.price).toHaveProperty("usdPrice");
        expect(typeof token.price.usdPrice).toBe("number");
      }
      expect(token).toHaveProperty("coingeckoId");
      expect(
        token.coingeckoId === null || typeof token.coingeckoId === "string"
      ).toBe(true);
    }
  });
});
