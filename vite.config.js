// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/**",
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
      },
      release: {
        name: process.env.COMMIT_REF || new Date().toISOString(),
        injectReleasesMap: true,
        setCommits: { auto: true },
      },
      define: {
        __SENTRY_RELEASE__: JSON.stringify(process.env.COMMIT_REF || ""),
      },
      telemetry: false,
    }),
  ],
  optimizeDeps: {
    include: ["buffer"],
  },
  build: {
    sourcemap: true,
  },
});
