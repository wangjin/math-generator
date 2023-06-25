import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: 'pnpm',
  plugins: ['umi-plugin-electron-builder'],
  electronBuilder: {
    builderOptions: {
      appId: "com.github.wangjin.math-generator",
      productName: "口算生成器",
      mac: {
        identity: 'com.github.wangjin.math-generator'
      }
    },
  },
});
