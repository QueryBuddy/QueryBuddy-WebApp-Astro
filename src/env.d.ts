/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
  readonly GOOGLE_API_KEY: string;
  readonly GOOGLE_CSE_ID: string;
  readonly OPENWEATHER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 