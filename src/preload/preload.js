const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hudley', {
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
});
