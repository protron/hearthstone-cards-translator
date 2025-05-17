/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARDS_LAST_UPDATE: string;
  readonly VITE_BUILD_TIMESTAMP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
