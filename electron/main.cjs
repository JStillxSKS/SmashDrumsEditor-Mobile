const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");
const { startStaticServer } = require("./staticServer.cjs");

const isDev = !app.isPackaged;
const devUrl = process.env.ELECTRON_START_URL || "http://127.0.0.1:5174";
const distRoot = path.join(__dirname, "..", "dist");

/** @type {import("node:http").Server | null} */
let staticServer = null;
let appUrl = devUrl;

async function ensureAppUrl() {
  if (isDev) {
    appUrl = devUrl;
    return;
  }
  if (appUrl && staticServer) return;
  const { server, url } = await startStaticServer(distRoot);
  staticServer = server;
  appUrl = url;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on("did-fail-load", (_event, code, description, validatedURL) => {
    dialog.showErrorBox(
      "Smash Drums Editor failed to load",
      `${description} (${code})\n\nURL: ${validatedURL || appUrl}`
    );
  });

  mainWindow.loadURL(appUrl).catch((err) => {
    dialog.showErrorBox("Smash Drums Editor failed to load", String(err));
  });
}

app.whenReady().then(async () => {
  try {
    await ensureAppUrl();
  } catch (err) {
    dialog.showErrorBox("Smash Drums Editor failed to start", String(err));
    app.quit();
    return;
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});