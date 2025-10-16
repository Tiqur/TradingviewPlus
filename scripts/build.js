#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, cpSync } from "fs";
import path from "path";

const args = process.argv.slice(2);
const rootDir = process.cwd();
const tempDir = path.join(rootDir, "temp");
const distDir = path.join(rootDir, "dist");

const configs = {
  firefox: { manifest: "platform/firefox/manifest.json", output: "tvp-firefox.xpi" },
  chrome: { manifest: "platform/chrome/manifest.json", output: "tvp-chrome.zip" },
  opera: { manifest: "platform/opera/manifest.json", output: "tvp-opera.zip" },
};

// Run a command safely
function run(cmd, silent = false) {
  console.log(silent ? "" : `> ${cmd}`);
  execSync(cmd, { stdio: silent ? "ignore" : "inherit", shell: true });
}

// --- Auto-install required packages ---
function ensureDependencies() {
  const required = ["typescript", "sass"];
  const missing = required.filter((pkg) => {
    try {
      execSync(`npm ls ${pkg} --depth=0`, { stdio: "ignore" });
      return false;
    } catch {
      return true;
    }
  });

  if (missing.length > 0) {
    console.log(`📦 Installing missing dependencies: ${missing.join(", ")} ...`);
    run(`npm install --save-dev ${missing.join(" ")}`);
  }
}

async function build(browser, config) {
  console.log(`\n🚀 Building for ${browser.toUpperCase()}...`);

  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir);

  cpSync("public", path.join(tempDir, "public"), { recursive: true });
  cpSync("dist", path.join(tempDir, "dist"), { recursive: true });
  cpSync(config.manifest, path.join(tempDir, "manifest.json"));

  const zipCmd = `cd "${tempDir}" && zip -r "../${config.output}" * -x "*.map" -x "*.scss"`;
  run(zipCmd);

  rmSync(tempDir, { recursive: true, force: true });
  console.log(`✅ ${browser} build complete → ${config.output}`);
}

try {
  // Step 0: Ensure dependencies
  ensureDependencies();

  // If no argument passed, build all
  if (args.length === 0) {
    console.log("⚙️ Compiling TypeScript...");
    run("npx tsc");

    console.log("🎨 Compiling SCSS...");
    run("npx sass public/:dist/");

    if (!existsSync(distDir)) mkdirSync(distDir);
    console.log("📁 Copying lib → dist...");
    cpSync("lib", distDir, { recursive: true });

    for (const [browser, config] of Object.entries(configs)) {
      await build(browser, config);
    }

    console.log("\n🎉 All builds completed successfully!");
    process.exit(0);
  }

  // If specific browser passed
  const browser = args[0];
  const config = configs[browser];
  if (!config) {
    console.error("❌ Invalid argument. Supported values: firefox | chrome | opera");
    process.exit(1);
  }

  console.log(`🧱 Building single target: ${browser}`);
  console.log("⚙️ Compiling TypeScript...");
  run("npx tsc");

  console.log("🎨 Compiling SCSS...");
  run("npx sass public/:dist/");

  if (!existsSync(distDir)) mkdirSync(distDir);
  cpSync("lib", distDir, { recursive: true });

  await build(browser, config);
} catch (err) {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
}
