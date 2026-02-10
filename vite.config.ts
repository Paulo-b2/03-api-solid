// vite.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        
        test: {
          include: ["src/http/**/*.spec.ts"],
          environment: path.resolve(
            __dirname,
            "prisma/vitest-environment-prisma/prisma-test-environment.ts"
          ),
        },
      },
    ],
  },
});