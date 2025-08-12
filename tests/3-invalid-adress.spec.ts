import { test, expect, request } from "@playwright/test";

const API_URL = "https://wallet-api.solflare.com";
const AUTH_TOKEN = "73866a97-1a4e-4807-8e5e-cf33e150ce2d";

test.describe("Break the API Tests", () => {
  test("should return 400 for invalid address", async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    const invalidAddress = "invalidAddress123";

    const response = await apiContext.get(
      `/v3/portfolio/tokens/${invalidAddress}`
    );

    expect([400]).toContain(response.status());

    const responseBody = await response.text();
    console.log("Status code:", response.status());

    expect(responseBody.toLowerCase()).toMatch(
      /error|not found|bad request|invalid/i
    );
  });

  test("should return 404 for invalid address", async () => {
    const apiContext = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    const invalidAddress = "11111111111111111111111111111110";

    const response = await apiContext.get(
      `/v3/portfolio/tokens/${invalidAddress}`
    );

    // Getting only 400 here
    expect([404]).toContain(response.status());

    const responseBody = await response.text();
    console.log("Status code:", response.status());

    expect(responseBody.toLowerCase()).toMatch(
      /error|not found|bad request|invalid/i
    );
  });
});
