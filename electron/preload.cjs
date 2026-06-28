const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isDesktop: true,
  getOutputDir: () => ipcRenderer.invoke("output:getDir"),
  saveFile: (relativePath, data, encoding = "utf8") =>
    ipcRenderer.invoke("output:save", { relativePath, data, encoding }),
  openOutputDir: () => ipcRenderer.invoke("output:open"),
});