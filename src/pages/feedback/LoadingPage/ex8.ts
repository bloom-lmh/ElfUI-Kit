import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "无边框自定义图标与动画", en: "Borderless custom icon and animation" },
  loadingText: { zh: "正在连接设计工作区", en: "Connecting the design workspace" },
  content: { zh: "品牌资源同步中", en: "Brand assets are syncing" },
});

const code = `<elf-loading
  loading
  plain
  text="${t("loadingText")}"
>
  <span slot="indicator" class="brand-loader">
    <i class="brand-core">E</i><i class="brand-orbit"></i>
  </span>
  <div style="min-height:160px">${t("content")}</div>
</elf-loading>`;

const script = `/* The indicator slot accepts any icon component or CSS animation. */`;

defineStyle(`
  .custom-loading-stage {
    width: min(620px, 100%);
    min-height: 190px;
    padding: 26px;
    border: 1px solid var(--elf-border);
    border-radius: 8px;
    background: var(--elf-bg-paper);
  }
  .brand-loader {
    position: relative;
    display: grid;
    width: 58px;
    height: 58px;
    place-items: center;
  }
  .brand-core {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 10px;
    background: var(--elf-primary);
    color: #fff;
    font-style: normal;
    font-weight: 800;
  }
  .brand-orbit {
    position: absolute;
    inset: 0;
    border: 2px solid color-mix(in srgb, var(--elf-primary) 24%, transparent);
    border-radius: 50%;
    animation: brand-loading-orbit 900ms linear infinite;
  }
  .brand-orbit::after {
    position: absolute;
    top: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--elf-primary);
    content: "";
    transform: translateX(-50%);
  }
  @keyframes brand-loading-orbit { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .brand-orbit { animation: none; } }
`);

const PageLoadingEx8 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-loading
      loading
      plain
      :text=${t("loadingText")}
    >
      <span slot="indicator" class="brand-loader" aria-hidden="true">
        <i class="brand-core">E</i><i class="brand-orbit"></i>
      </span>
      <div class="custom-loading-stage">
        ${t("content")}
      </div>
    </elf-loading>
  </elf-playground>
`);

export { PageLoadingEx8 };
