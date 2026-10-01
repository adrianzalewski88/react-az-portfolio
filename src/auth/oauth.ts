const OAUTH_AUTHORIZE_URL =
  import.meta.env.VITE_OAUTH_AUTHORIZE_URL;

const OAUTH_TOKEN_URL =
  import.meta.env.VITE_OAUTH_TOKEN_URL;

const CLIENT_ID =
  import.meta.env.VITE_OAUTH_CLIENT_ID;

const REDIRECT_URI =
  import.meta.env.VITE_OAUTH_REDIRECT_URI;

const SCOPE = "portfolio:read";

const ACCESS_TOKEN_KEY =
  "portfolio_access_token";

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(
    String.fromCharCode(...new Uint8Array(buffer)),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length = 64): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const values = new Uint8Array(length);

  crypto.getRandomValues(values);

  return Array.from(
    values,
    (value) => characters[value % characters.length],
  ).join("");
}

async function createCodeChallenge(
  verifier: string,
): Promise<string> {
  const data = new TextEncoder().encode(verifier);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data,
  );

  return base64UrlEncode(digest);
}

export async function startOAuthLogin(): Promise<void> {
  const codeVerifier = generateRandomString();

  const codeChallenge =
    await createCodeChallenge(codeVerifier);

  sessionStorage.setItem(
    "oauth_code_verifier",
    codeVerifier,
  );

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href =
    `${OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<string> {
  const codeVerifier =
    sessionStorage.getItem("oauth_code_verifier");

  if (!codeVerifier) {
    throw new Error(
      "OAuth code verifier is missing.",
    );
  }

  const response = await fetch(
    OAUTH_TOKEN_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Accept: "application/json",
      },

      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code,
        code_verifier: codeVerifier,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `OAuth token request failed: ${response.status} ${error}`,
    );
  }

  const data = await response.json();

  sessionStorage.removeItem(
    "oauth_code_verifier",
  );

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.access_token,
  );

  return data.access_token;
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(
    ACCESS_TOKEN_KEY,
  );
}

export function clearAccessToken(): void {
  sessionStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );
}