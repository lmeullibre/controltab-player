import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'copy-svelte-components',
      closeBundle() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        const srcComponentsDir = resolve(__dirname, 'src/lib/components');
        const distComponentsDir = resolve(__dirname, 'dist/components');

        // Ensure dist/components directory exists
        if (!fs.existsSync(distComponentsDir)) {
          fs.mkdirSync(distComponentsDir, { recursive: true });
        }

        // Copy Svelte components to dist
        fs.readdirSync(srcComponentsDir).forEach(file => {
          if (file.endsWith('.svelte')) {
            fs.copyFileSync(
              resolve(srcComponentsDir, file), 
              resolve(distComponentsDir, file)
            );
          }
        });
      }
    }
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'ControlTabPlayer',
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'svelte', 
        '@coderline/alphatab', 
        '@coderline/alphatab/dist/alphaTab.css'
      ],
      output: {
        globals: {
          svelte: 'Svelte',
          '@coderline/alphatab': 'AlphaTab'
        }
      }
    }
  }
});