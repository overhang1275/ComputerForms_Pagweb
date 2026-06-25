import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://computerforms.com.mx",
  integrations: [react(), tailwind(), sitemap()],
});
