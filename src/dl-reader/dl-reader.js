
import { readFile } from 'node:fs/promises'

export const readDatalog = (datalogPath) => {

  console.log('gonna read datalog', datalogPath)
  return readFile(datalogPath, { encoding: 'utf8' })
}

