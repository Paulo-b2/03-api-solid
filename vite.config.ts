import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
});
// dessa maneira o vitest vai conseguir entender automaticamente as importações com '@/' feitas dentro dos testes
