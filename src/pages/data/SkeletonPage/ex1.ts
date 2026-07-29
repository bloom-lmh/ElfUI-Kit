import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  textTitle: { zh: "文字骨架", en: "Text skeleton" },
  textPlayground: { zh: "单行与多行段落", en: "Single-line and multi-line paragraphs" },
  shapesTitle: { zh: "圆形、矩形与图片", en: "Circle, rectangle, and image" },
  shapesPlayground: { zh: "各种形状与自定义尺寸", en: "Multiple shapes with custom sizes" },
  imageTitle: { zh: "图片占位", en: "Image placeholder" },
  imagePlayground: { zh: "image 变体使用矩形与默认高度", en: "The image variant uses a rectangle and default height" },
  loadingTitle: { zh: "加载状态与自定义模板", en: "Loading state and custom template" },
  show: { zh: "显示内容", en: "Show content" },
  reload: { zh: "重新加载", en: "Reload" },
  loaded: { zh: "内容已加载", en: "Loaded content" },
  loadedDetail: { zh: "默认插槽只会在加载结束后显示。", en: "The default slot appears only after loading finishes." },
  toggle: { zh: "切换加载状态", en: "Toggle loading" }
});
const loading = useRef(true);
const toggleLoading = (): void => loading.set(!loading.value);

const code1 = `<elf-skeleton loading />
<elf-skeleton loading variant="text" count="3" gap="12px" style="margin-top:16px" />
<elf-skeleton loading variant="text" count="1" width="60%" style="margin-top:8px" />`;

const code2 = `<elf-skeleton loading variant="circle" width="64px" height="64px" />
<elf-skeleton loading variant="circle" width="48px" height="48px" />
<elf-skeleton loading variant="circle" width="32px" height="32px" />

<elf-skeleton loading variant="rect" width="100%" height="200px" />
<elf-skeleton loading variant="rect" width="60%" height="40px" />
<elf-skeleton loading variant="rect" width="40%" height="24px" />`;

const code3 = `<elf-skeleton loading variant="image" width="100%" height="180px" />
<elf-skeleton loading variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
<elf-skeleton loading variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />`;

const code4 = `<elf-button @click=\${toggleLoading}>${t("toggle")}</elf-button>
<elf-skeleton :loading="loading" :throttle="200">
  <article>${t("loaded")}</article>
  <template #template>
    <elf-skeleton loading rows="2" animated />
  </template>
</elf-skeleton>`;

const code4Script = `const loading = useRef(true);
const toggleLoading = () => loading.set(!loading.value);`;

const PageSkeletonEx1 = defineHtml(`
  <h2>${t("textTitle")}</h2>
  <elf-playground :title=${t("textPlayground")} :code="code1">
    <div style="width:360px">
      <elf-skeleton loading />
      <elf-skeleton loading variant="text" count="3" gap="12px" style="margin-top:16px" />
      <elf-skeleton loading variant="text" count="1" width="60%" style="margin-top:8px" />
    </div>
  </elf-playground>

  <h2>${t("shapesTitle")}</h2>
  <elf-playground :title=${t("shapesPlayground")} :code="code2">
    <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:360px">
      <div style="display:flex;gap:16px;align-items:flex-end">
        <elf-skeleton loading variant="circle" width="64px" height="64px" />
        <elf-skeleton loading variant="circle" width="48px" height="48px" />
        <elf-skeleton loading variant="circle" width="32px" height="32px" />
      </div>
      <elf-skeleton loading variant="rect" width="100%" height="200px" />
      <elf-skeleton loading variant="rect" width="60%" height="40px" />
      <elf-skeleton loading variant="rect" width="40%" height="24px" />
    </div>
  </elf-playground>

  <h2>${t("imageTitle")}</h2>
  <elf-playground :title=${t("imagePlayground")} :code="code3">
    <div style="width:360px">
      <elf-skeleton loading variant="image" width="100%" height="180px" />
      <elf-skeleton loading variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
      <elf-skeleton loading variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />
    </div>
  </elf-playground>

  <h2>${t("loadingTitle")}</h2>
  <elf-playground title="loading / throttle / template" :code=${code4} :script=${code4Script}>
    <div style="display:grid;gap:12px;width:360px">
      <elf-button size="sm" @click=${toggleLoading}>${t("toggle")}</elf-button>
      <elf-skeleton :loading=${loading} :throttle=${200} animated>
        <article style="padding:16px;border:1px solid var(--elf-border);border-radius:8px">
          <strong>${t("loaded")}</strong>
          <p style="margin:6px 0 0;color:var(--elf-text-secondary)">${t("loadedDetail")}</p>
        </article>
        <template #template>
          <elf-skeleton loading rows="2" animated />
        </template>
      </elf-skeleton>
    </div>
  </elf-playground>
`);

export { PageSkeletonEx1 };
