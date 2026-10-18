import { webcrypto } from "node:crypto";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import {
  clearAccessToken,
  exchangeCodeForToken,
  getAccessToken,
  startOAuthLogin,
} from "../src/auth/oauth";
import { server } from "./mocks/server";

const OAUTH_TOKEN_URL = import.meta.env.VITE_OAUTH_TOKEN_URL;

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

describe("OAuth utilities", () => {
  it("stores a PKCE verifier and builds an S256 authorization URL", async () => {
    vi.stubGlobal("crypto", webcrypto);

    const fakeWindow = { location: { href: "" } };
    vi.stubGlobal("window", fakeWindow);

    await startOAuthLogin();

    const verifier = sessionStorage.getItem("oauth_code_verifier");

    expect(verifier).not.toBeNull();

    if (verifier === null) {
      throw new Error("Expected an OAuth code verifier to be stored.");
    }

    expect(verifier).toHaveLength(64);

    const authorizationUrl = new URL(fakeWindow.location.href);
    const params = authorizationUrl.searchParams;

    expect(authorizationUrl.origin).toBe("http://localhost:8000");
    expect(params.get("client_id")).toBe("az-portfolio-test");
    expect(params.get("redirect_uri")).toBe(
      "http://localhost:5173/auth/callback",
    );
    expect(params.get("response_type")).toBe("code");
    expect(params.get("scope")).toBe("portfolio:read");
    expect(params.get("code_challenge_method")).toBe("S256");

    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier),
    );

    expect(params.get("code_challenge")).toBe(base64UrlEncode(digest));
  });

  it("exchanges a code, saves the access token, and removes the verifier", async () => {
    sessionStorage.setItem("oauth_code_verifier", "test-verifier");

    const requestBodies: URLSearchParams[] = [];

    server.use(
      http.post(OAUTH_TOKEN_URL, async ({ request }) => {
        requestBodies.push(new URLSearchParams(await request.text()));
        return HttpResponse.json({ access_token: "new-access-token" });
      }),
    );

    await expect(exchangeCodeForToken("authorization-code")).resolves.toBe(
      "new-access-token",
    );

    expect(requestBodies).toHaveLength(1);
    expect(requestBodies[0]?.get("grant_type")).toBe("authorization_code");
    expect(requestBodies[0]?.get("code")).toBe("authorization-code");
    expect(requestBodies[0]?.get("code_verifier")).toBe("test-verifier");
    expect(getAccessToken()).toBe("new-access-token");
    expect(sessionStorage.getItem("oauth_code_verifier")).toBeNull();
  });

  it("rejects code exchange when the verifier is missing", async () => {
    await expect(exchangeCodeForToken("authorization-code")).rejects.toThrow(
      "OAuth code verifier is missing.",
    );
  });

  it("preserves the verifier and reports token endpoint errors", async () => {
    sessionStorage.setItem("oauth_code_verifier", "test-verifier");

    server.use(
      http.post(OAUTH_TOKEN_URL, () => {
        return new HttpResponse("invalid code", { status: 400 });
      }),
    );

    await expect(exchangeCodeForToken("bad-code")).rejects.toThrow(
      "OAuth token request failed: 400 invalid code",
    );
    expect(sessionStorage.getItem("oauth_code_verifier")).toBe(
      "test-verifier",
    );
  });

  it("clears the saved access token", () => {
    sessionStorage.setItem("portfolio_access_token", "test-token");

    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });
});