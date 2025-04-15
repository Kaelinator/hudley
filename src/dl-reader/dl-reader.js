import { readFile } from 'node:fs/promises';

export default (datalogPath) => readFile(datalogPath, { encoding: 'utf8' });
