import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths(),
    // Serve /source directory at /source URL path for restaurant images
    {
      name: 'serve-source-dir',
      configureServer(server) {
        server.middlewares.use('/source', (req, res, next) => {
          const filePath = path.join(process.cwd(), 'source', req.url || '');
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      }
    }
  ],
})
