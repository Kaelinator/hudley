const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hudley', {

  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),

  readDatalog: (path) => ipcRenderer.invoke('read-datalog', path),

  initRender: (renderPath, options) => ipcRenderer.invoke('init-render', renderPath, options),
  addFrame: (frame, alpha) => ipcRenderer.invoke('add-frame', frame, alpha),
  completeRender: () => ipcRenderer.invoke('complete-render'),
});
