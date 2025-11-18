import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/tickets': {
          target: env.PROXY_TARGET, 
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/tickets/, env.PROXY_REWRITE || '/controller/venta/table_ticket.php'),
        },
        "/api/usuarios": {
          target: env.PROXY_TARGET,
          changeOrigin: true,
          secure: true,
          rewrite: (path) =>
            path.replace(
              /^\/api\/usuarios/,
              "/controller/table_usuario.php"
            ),
        },
      },
    },
  };
});
