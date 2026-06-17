import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { buildXDC } from "@webxdc/vite-plugins";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), buildXDC()],
  resolve: {
    // We depend on IronCalc via a `link:` symlink so checkout rebuilds are
    // picked up live. The symlink drags in the checkout's own node_modules,
    // which would otherwise load a second copy of React and crash hooks.
    // Deduping pins us to a single React/React DOM regardless of resolution.
    dedupe: ["react", "react-dom"],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ["../../../"],
    },
  },
});
