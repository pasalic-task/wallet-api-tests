import { test, expect, request } from "@playwright/test";

const API_URL =
  "https://wallet-api.solflare.com/v3/portfolio/tokens/HuiTegTpNAU7EJXvn95HKEWBdFMtWZYko4yoFVQyCKUS";
const AUTH_TOKEN = "73866a97-1a4e-4807-8e5e-cf33e150ce2d";

test.describe.configure({ mode: "serial" }); // OVAJ BLOK SERIJALIZIRA TESTOVE
test.describe("Switching network should restore mainnet response", () => {
  let mainnetTokens1: any[];
  let devnetTokens: any[];
  let mainnetTokens2: any[];

  test("First request: Mainnet - fetch and store response", async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const response = await apiContext.get("", {
      params: { network: "mainnet" },
    }); // eksplicitno mainnet
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    mainnetTokens1 = data.tokens;

    console.log(`Mainnet #1 tokens count: ${mainnetTokens1.length}`);
    expect(mainnetTokens1.length).toBeGreaterThan(0); // sanity check
  });

  test("Second request: Devnet - fetch and validate additional tokens", async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const response = await apiContext.get("", {
      params: { network: "devnet" },
    }); // prebacujemo na devnet
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    devnetTokens = data.tokens;

    console.log(`Devnet tokens count: ${devnetTokens.length}`);
    expect(devnetTokens.length).toBeGreaterThan(mainnetTokens1.length); // očekujemo više tokena na devnetu
  });

  test("Third request: Back to Mainnet - response should match the first", async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const response = await apiContext.get("", {
      params: { network: "mainnet" },
    }); // vraćamo se na mainnet
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    mainnetTokens2 = data.tokens;

    console.log(`Mainnet #2 tokens count: ${mainnetTokens2.length}`);
    expect(mainnetTokens2.length).toBe(mainnetTokens1.length);

    for (let i = 0; i < mainnetTokens1.length; i++) {
      const token1 = { ...mainnetTokens1[i] };
      const token2 = { ...mainnetTokens2[i] };

      delete token1.price; // price se može mijenjati
      delete token2.price;

      expect(token2).toEqual(token1);
    }
  });
});
