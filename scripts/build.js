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

// --- Utility to run shell commands ---
function run(cmd, silent = false) {
  console.log(silent ? "" : `> ${cmd}`);
  execSync(cmd, { stdio: silent ? "ignore" : "inherit", shell: true });
}

// --- Ensure required dev dependencies are present ---
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

// --- Copy lib → dist/lib with safeguard for purify.min.js ---
function copyLibToDist() {
  console.log("📁 Copying lib → dist/lib...");
  const libDir = path.join(rootDir, "lib");
  const distLibDir = path.join(distDir, "lib");

  mkdirSync(distDir, { recursive: true });
  mkdirSync(distLibDir, { recursive: true });

  if (existsSync(libDir)) {
    cpSync(libDir, distLibDir, { recursive: true, force: true });
    console.log("✅ Copied lib → dist/lib");

    // Safeguard: copy purify.min.js to both dist and dist/lib
    const purifySrc = path.join(libDir, "purify.min.js");
    const purifyDest1 = path.join(distDir, "purify.min.js");
    const purifyDest2 = path.join(distLibDir, "purify.min.js");

    if (existsSync(purifySrc)) {
      cpSync(purifySrc, purifyDest1, { force: true });
      cpSync(purifySrc, purifyDest2, { force: true });
      console.log("🧩 Copied purify.min.js → dist/ and dist/lib/");
    } else {
      console.warn("⚠️ purify.min.js not found in lib/");
    }
  } else {
    console.warn("⚠️ lib directory not found");
  }
}

// --- Core build logic ---
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

  // Step 1: No args → build all
  if (args.length === 0) {
    console.log("⚙️ Compiling TypeScript...");
    run("npx tsc");

    console.log("🎨 Compiling SCSS...");
    run("npx sass public/:dist/");

    copyLibToDist();

    for (const [browser, config] of Object.entries(configs)) {
      await build(browser, config);
    }

    console.log("\n🎉 All builds completed successfully!");
    process.exit(0);
  }

  // Step 2: Build for specific browser
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

  copyLibToDist();

  await build(browser, config);
} catch (err) {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
}
