import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [react()],
	// Server configuration for development
	server: {
		port: 8080,
		strictPort: false,
		open: false,
	},

	// Preview configuration
	preview: {
		port: 8080,
		strictPort: false,
	},

	// Build configuration
	build: {
		outDir: 'dist',
		target: 'es2022',
		minify: 'terser',
		sourcemap: false,
		rollupOptions: {
			output: {
				// Configure output format
				format: 'es',
			},
		},
	},

	// Module resolution
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},

	// Optimize dependencies
	optimizeDeps: {
		include: [],
	},

	// Environment variables
	define: {
		'process.env.NODE_ENV': JSON.stringify(
			process.env['NODE_ENV'] || 'development'
		),
	},
});
