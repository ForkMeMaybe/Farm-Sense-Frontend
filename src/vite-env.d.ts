/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_ENVIRONMENT: string
    readonly VITE_ENABLE_DEBUG: string
    readonly VITE_DEFAULT_LANGUAGE: string
    readonly VITE_SUPPORTED_LANGUAGES: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
