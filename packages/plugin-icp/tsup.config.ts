import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    target: 'es2022',
    outDir: 'dist',
    external: [
        '@elizaos/core',
        '@elizaos/plugin-telegram',
        '@dfinity/agent',
        '@dfinity/candid',
        '@dfinity/principal',
        '@prisma/client'
    ]
});
