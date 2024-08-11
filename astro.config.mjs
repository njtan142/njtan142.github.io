import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import UnoCSS from "@unocss/astro";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";
import { remarkReadingTime } from "./src/lib/ remark-reading-time.mjs";

import svelte from "@astrojs/svelte";
// https://astro.build/config
export default defineConfig({
    site: "https://njtan142.github.io/",
    integrations: [
        sitemap(),
        robotsTxt(),
        solidJs(),
        UnoCSS({ injectReset: true }),
        icon(),
        svelte(),
      ],
      markdown: {
        remarkPlugins: [remarkReadingTime],
      },
      output: "server",
      vite: {
        assetsInclude: "**/*.riv",
      },
});



