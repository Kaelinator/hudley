import { expect, test } from 'vitest';
import readDatalog from './dl-reader';

test('reads file', async () => {
  // yes I know this is more of an integration test blah blah sue me
  await expect(readDatalog('test-data/foo.txt')).resolves.toEqual('hi im test data\n');
});
