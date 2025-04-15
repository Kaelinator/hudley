const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hudley', {
  readDatalog: (datalogPath) => ipcRenderer.invoke('readDatalog', datalogPath),
});
