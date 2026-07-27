import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "尺寸、形状与图标", en: "Size, shape, and icons" },
  status: { zh: "尺寸用于层级，形状用于操作类型", en: "Size expresses hierarchy; shape expresses action type" },
  sizes: { zh: "三种尺寸", en: "Three sizes" },
  shapes: { zh: "操作形状", en: "Action shapes" },
  icons: { zh: "图标与方向", en: "Icons and direction" },
  small: { zh: "小按钮", en: "Small" },
  medium: { zh: "中按钮", en: "Medium" },
  large: { zh: "大按钮", en: "Large" },
  rounded: { zh: "圆角操作", en: "Rounded action" },
  refresh: { zh: "刷新数据", en: "Refresh data" },
  settings: { zh: "打开设置", en: "Open settings" },
  download: { zh: "下载", en: "Download" },
  send: { zh: "发送", en: "Send" },
  upload: { zh: "上传文件", en: "Upload file" },
  block: { zh: "创建新项目", en: "Create project" }
});

const shapeCode = `<elf-button size="sm">Small</elf-button>
<elf-button size="md">Medium</elf-button>
<elf-button size="lg">Large</elf-button>

<elf-button round>Rounded action</elf-button>
<elf-button circle icon="↻" aria-label="Refresh data"></elf-button>
<elf-button shape="square" icon="⚙" aria-label="Open settings"></elf-button>

<elf-button icon="↓">Download</elf-button>
<elf-button direction="vertical" icon="↑">Upload file</elf-button>
<elf-button block>Create project</elf-button>`;

const shapeScript = `// 纯图标按钮必须提供 aria-label。
// block 只负责占满容器；容器宽度仍由业务布局控制。`;

defineStyle(styles);

const PageButtonEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${shapeCode} :script=${shapeScript}>
    <span slot="status" class="button-demo-status">${t("status")}</span>
    <div class="button-feature-grid">
      <article class="button-demo-card">
        <strong>${t("sizes")}</strong>
        <div class="button-demo-row button-demo-row-baseline">
          <elf-button size="sm">${t("small")}</elf-button>
          <elf-button size="md">${t("medium")}</elf-button>
          <elf-button size="lg">${t("large")}</elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>${t("shapes")}</strong>
        <div class="button-demo-row">
          <elf-button round>${t("rounded")}</elf-button>
          <elf-button circle icon="↻" :aria-label=${t("refresh")}></elf-button>
          <elf-button
            shape="square"
            icon="⚙"
            variant="outlined"
            :aria-label=${t("settings")}
          ></elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>${t("icons")}</strong>
        <div class="button-demo-row">
          <elf-button icon="↓">${t("download")}</elf-button>
          <elf-button color="success">${t("send")}<span slot="suffix-icon">→</span></elf-button>
          <elf-button direction="vertical" variant="outlined" icon="↑">${t("upload")}</elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>Block</strong>
        <elf-button block>${t("block")}</elf-button>
      </article>
    </div>
  </elf-playground>
`);

export { PageButtonEx2 };
