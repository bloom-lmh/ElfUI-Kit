/// <reference types="vite/client" />

// Vite 的 ?inline / ?raw query 加载样式为字符串
declare module "*.scss?inline" {
  const css: string;
  export default css;
}

declare module "*.css?inline" {
  const css: string;
  export default css;
}

declare module "*.scss?raw" {
  const css: string;
  export default css;
}
