/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_AUTHORIZE_URL: string;
  readonly VITE_OAUTH_TOKEN_URL: string;
  readonly VITE_OAUTH_CLIENT_ID: string;
  readonly VITE_OAUTH_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}