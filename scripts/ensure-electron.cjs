const { downloadArtifact } = require("@electron/get");
const extract = require("extract-zip");
const fs = require("node:fs");
const path = require("node:path");

const electronDir = path.join(__dirname, "..", "node_modules", "electron");
const distDir = path.join(electronDir, "dist");
const pathFile = path.join(electronDir, "path.txt");
const { version } = require(path.join(electronDir, "package.json"));

const platformPath = process.platform === "win32" ? "electron.exe" : "electron";

function isInstalled() {
  try {
    const installedVersion = fs
      .readFileSync(path.join(distDir, "version"), "utf8")
      .replace(/^v/, "")
      .trim();
    const installedPath = fs.readFileSync(pathFile, "utf8").trim();
    return (
      installedVersion === version &&
      installedPath === platformPath &&
      fs.existsSync(path.join(distDir, platformPath))
    );
  } catch {
    return false;
  }
}

async function main() {
  if (process.env.ELECTRON_SKIP_BINARY_DOWNLOAD || isInstalled()) return;

  const zipPath = await downloadArtifact({
    version,
    artifactName: "electron",
    platform: process.env.npm_config_platform || process.platform,
    arch: process.env.npm_config_arch || process.arch,
  });

  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  await extract(zipPath, { dir: path.resolve(distDir) });
  fs.writeFileSync(pathFile, platformPath);
  fs.writeFileSync(path.join(distDir, "version"), `v${version}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});