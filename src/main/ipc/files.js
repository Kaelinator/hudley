import { dialog, ipcMain } from 'electron';
import { basename } from 'path';

const showOpenDialog = (_event, options) =>
  dialog.showOpenDialog(options)
    .then((result) => ({
      ...result,
      basenames: result.filePaths.map((p) => basename(p)),
    }));

const showSaveDialog = (_event, options) =>
  dialog.showSaveDialog(options)
    .then((result) => ({
      ...result,
      basename: basename(result.filePath),
    }));

export const registerFileHandlers = () => {
  ipcMain.handle('show-open-dialog', showOpenDialog);
  ipcMain.handle('show-save-dialog', showSaveDialog);
}
