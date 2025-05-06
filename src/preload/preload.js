const { contextBridge, ipcRenderer } = require('electron');
const { open } = require('fs/promises');
const WebMWriter = require('webm-writer');

contextBridge.exposeInMainWorld('hudley', {
  readDatalog: (datalogPath) => ipcRenderer.invoke('readDatalog', datalogPath),
  createWebmWriter: async (outputPath) => {
    const fileHandle = await open(outputPath, 'w+');
    const writer = new WebMWriter({
      quality: 0.99999,
      fd: fileHandle.fd,
      frameRate: 30,
      transparent: true,
    });

    return {
      addFrame: (frame, alpha, overrideFrameDuration) => {
        writer.addFrame(frame, alpha, overrideFrameDuration);
      },
      complete: () => writer.complete().then(() => fileHandle.close()),
    };
  },
});
