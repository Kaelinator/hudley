import { ipcMain } from 'electron';
import readDatalog from '../dl-reader/dl-reader';

export const registerDatalogHandlers = () => {
  ipcMain.handle('read-datalog', (_event, path) => readDatalog(path));
};
