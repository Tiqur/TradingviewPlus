#!/usr/bin/env node

import { execSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  rmSync,
  cpSync,
  readdirSync,
  statSync,
} from "fs";
import path from "path";
import os from "os";

// ----------- setup & args -----------
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: node scripts/dev.js [firefox|chrome|opera]");
  process.exit(1);
}

const browser = args[0];
const rootDir = process.cwd();
const tmpDir = path.join(rootDir, "tmp-dir");
const webUrl = "https://www.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD";

// ----------- helpers -----------
function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
}

function findFileRecursive(dir, pattern) {
  try {
    for (const file of readdirSync(dir)) {
      const full = path.join(dir, file);
      const stats = statSync(full);
      if (stats.isDirectory()) {
        const res = findFileRecursive(full, pattern);
        if (res) return res;
      } else if (pattern.test(file)) {
        return full;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function firstExisting(paths = []) {
  for (const p of paths) {
    if (p && existsSync(p)) return p;
  }
  return null;
}

function findChromeForTestingWin() {
  const L = process.env.LOCALAPPDATA || "";
  const U = process.env.USERPROFILE || "";
  const cftPath = path.join(L, "Google", "Chrome for Testing", "Application", "chrome.exe");
  const pwRoot = path.join(U, "AppData", "Local", "ms-playwright");
  if (existsSync(cftPath)) return cftPath;
  if (existsSync(pwRoot)) {
    for (const e of readdirSync(pwRoot, { withFileTypes: true })) {
      if (e.isDirectory() && /chrom/i.test(e.name)) {
        const exe = path.join(pwRoot, e.name, "chrome-win64", "chrome.exe");
        if (existsSync(exe)) return exe;
      }
    }
  }
  return null;
}

function resolveOpera(userDir) {
  const gxExe = path.join(userDir, "AppData", "Local", "Programs", "Opera GX", "opera.exe");
  const stdExe = path.join(userDir, "AppData", "Local", "Programs", "Opera", "opera.exe");
  const gxLauncher = path.join(userDir, "AppData", "Local", "Programs", "Opera GX", "launcher.exe");

  if (existsSync(gxExe)) return gxExe;
  if (existsSync(stdExe)) return stdExe;
  if (existsSync(gxLauncher)) {
    const fallback = gxLauncher.replace(/launcher\.exe$/i, "opera.exe");
    if (existsSync(fallback)) return fallback;
  }

  for (const base of [
    path.join(userDir, "AppData", "Local", "Programs", "Opera GX"),
    path.join(userDir, "AppData", "Local", "Programs", "Opera"),
  ]) {
    const exe = findFileRecursive(base, /opera\.exe$/i);
    if (exe) return exe;
  }
  return null;
}

// ----------- detect platform -----------
const isWindows = os.platform() === "win32" || /microsoft/i.test(os.release());
let firefoxPath = "firefox";
let chromePath = "google-chrome";
let operaPath = "opera";

if (isWindows) {
  console.log("\n🪟 Detected Windows environment. Resolving browser paths dynamically...\n");
  const userDir = process.env.USERPROFILE || `C:\\Users\\${os.userInfo().username}`;
  const possiblePaths = {
    firefox: [
      "C:\\Program Files\\Firefox Developer Edition\\firefox.exe",
      "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
    ],
    chrome: [
      "C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe",
      "C:\\Program Files\\Google\\Chrome for Testing\\Application\\chrome.exe",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    ],
  };

  operaPath = resolveOpera(userDir) || path.join(userDir, "AppData", "Local", "Programs", "Opera GX", "opera.exe");
  firefoxPath = firstExisting(possiblePaths.firefox) || "firefox";
  chromePath = firstExisting(possiblePaths.chrome) || findChromeForTestingWin() || "chrome";

  console.log("🔍 Resolved browser paths:");
  console.log(`  Firefox → ${firefoxPath}`);
  console.log(`  Chrome  → ${chromePath}`);
  console.log(`  Opera   → ${operaPath}\n`);
}

if (!isWindows) {
  if (!existsSync("/usr/bin/google-chrome") && existsSync("/usr/bin/chromium-browser")) {
    chromePath = "chromium-browser";
    console.log("🌐 Using chromium-browser instead of google-chrome");
  }
  if (!existsSync("/usr/bin/opera") && existsSync("/usr/bin/opera-beta")) {
    operaPath = "opera-beta";
    console.log("🎭 Using opera-beta instead of opera");
  }
}

// ----------- build & launch -----------
if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });

try {
  console.log("📦 Installing dependencies...");
  run("npm install");

  console.log("📦 Ensuring required dev dependencies...");
  run("npm install --save-dev typescript sass web-ext");

  console.log("⚙️ Compiling TypeScript...");
  run("npx tsc");

  console.log("🎨 Compiling SCSS...");
  run("npx sass public/:dist/");

  console.log("📁 Copying lib → dist/lib...");
  const libDir = path.join(rootDir, "lib");
  const distLibDir = path.join(rootDir, "dist", "lib");

  if (existsSync(libDir)) {
    cpSync(libDir, distLibDir, { recursive: true, force: true });
    console.log("✅ Copied lib → dist/lib");
  } else {
    console.warn("⚠️ lib directory not found");
  }

  console.log("🧹 Cleaning old manifest...");
  try { rmSync(path.join(rootDir, "manifest.json")); } catch {}

  const manifestPath = `platform/${browser}/manifest.json`;
  if (!existsSync(manifestPath)) {
    console.error(`❌ Manifest not found for browser: ${browser}`);
    process.exit(1);
  }
  cpSync(manifestPath, path.join(rootDir, "manifest.json"));
  console.log(`✅ Copied ${manifestPath} → manifest.json`);

  console.log(`🚀 Launching in ${browser}...\n`);

  const webExtCmds = {
    firefox: `npx web-ext run --firefox="${firefoxPath}" --source-dir="${rootDir}" -u "${webUrl}" --keep-profile-changes`,
    chrome: `npx web-ext run --target=chromium --chromium-binary "${chromePath}" --source-dir="${rootDir}" -u "${webUrl}" --keep-profile-changes`,
    opera: `npx web-ext run --target=chromium --chromium-binary "${operaPath}" --source-dir="${rootDir}" -u "${webUrl}" --keep-profile-changes`,
  };

  const cmd = webExtCmds[browser];

  if (!cmd) {
    console.error("❌ Invalid browser. Use: firefox | chrome | opera");
    process.exit(1);
  }

  process.env.TMPDIR = tmpDir;
  run(cmd);

} catch (err) {
  console.error("\n💥 Build or launch failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}