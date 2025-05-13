/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_IMG_URL_PERN: string;
  // Добавьте другие переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
