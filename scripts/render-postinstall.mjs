import { execSync } from "node:child_process";

/**
 * Render's default build step is often only `npm install`.
 * When RENDER is set, run `next build` so `npm start` finds `.next/`.
 */
if (process.env.RENDER === "true") {
  console.log("Render: running production build after install...");
  execSync("npm run build", { stdio: "inherit" });
}
