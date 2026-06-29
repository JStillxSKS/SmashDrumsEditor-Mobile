const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isDesktop: true,
  getOutputDir: () => ipcRenderer.invoke("output:getDir"),
  saveFile: (relativePath, data, encoding = "utf8") =>
    ipcRenderer.invoke("output:save", { relativePath, data, encoding }),
  saveBinaryFile: (relativePath, bytes) =>
    ipcRenderer.invoke("output:saveBinary", { relativePath, bytes }),
  openOutputDir: () => ipcRenderer.invoke("output:open"),
  getFilePath: (file) => webUtils.getPathForFile(file),
  pickImportFile: () => ipcRenderer.invoke("import:pickFile"),
  readSiblingFile: (sourceFilePath, siblingName) =>
    ipcRenderer.invoke("fs:readSibling", { sourceFilePath, siblingName }),
});