import { ipcMain } from 'electron';
import WebMWriter from 'webm-writer';
import { open } from 'fs/promises';

let writer;
let outputFileHandle;

const initRender = async (_event, renderPath, options) => {

  if (outputFileHandle)
    await outputFileHandle.close();

  outputFileHandle = await open(renderPath, 'w+');
  writer = new WebMWriter({
    ...options,
    fd: outputFileHandle.fd,
  });
};

const addFrame = (_event, frame, alpha) => {
  if (!writer) throw new Error('Writer not initialized. Be sure to call initRender before addFrame.');

  return Promise.resolve(writer.addFrame(frame, alpha));
};

const completeRender = (_event) => {
  if (!writer) throw new Error('Writer not initialized. Be sure to call initRender before completeRender.');

  return writer.complete().then(() => outputFileHandle.close());
};

export const registerRenderHandlers = () => {
  ipcMain.handle('init-render', initRender);
  ipcMain.handle('add-frame', addFrame);
  ipcMain.handle('complete-render', completeRender);
};
