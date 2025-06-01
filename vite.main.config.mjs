import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import StringReplace from 'vite-plugin-string-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: false,
      }),
    },
    StringReplace([
      {
        /* WebMWriter.js doesn't need window cause it's running in node environment */
        fileName: 'WebMWriter.js',
        search: 'window\.',
        replace: '',
      },
      {
        /* WebMWriter.js doesn't need HTMLCanvasElement cause it's running in node environment */
        fileName: 'WebMWriter.js',
        search: 'HTMLCanvasElement',
        replace: 'Object',
      },
    ]),
  ],
});
