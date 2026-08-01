import { defineHtml, defineStyle } from "@elfui/core";
import { mdiCogOutline, mdiDownload, mdiRefresh, mdiSend, mdiUpload } from "@mdi/js";

import { createSvgIconSet } from "../../../components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "尺寸、形状与图标", en: "Size, shape, and icons" },
  status: {
    zh: "尺寸用于层级，形状用于操作类型",
    en: "Size expresses hierarchy; shape expresses action type",
  },
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
  block: { zh: "创建新项目", en: "Create project" },
});

const buttonIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      cog: mdiCogOutline,
      download: mdiDownload,
      refresh: mdiRefresh,
      send: mdiSend,
      upload: mdiUpload,
    }),
  },
};

const shapeCode = `<elf-icon-provider :options.prop=\${buttonIconOptions}>
<elf-button size="sm">Small</elf-button>
<elf-button size="md">Medium</elf-button>
<elf-button size="lg">Large</elf-button>

<elf-button round>Rounded action</elf-button>
<elf-button circle aria-label="Refresh data">
  <elf-icon slot="icon" name="refresh"></elf-icon>
</elf-button>
<elf-button shape="square" aria-label="Open settings">
  <elf-icon slot="icon" name="cog"></elf-icon>
</elf-button>

<elf-button><elf-icon slot="icon" name="download"></elf-icon>Download</elf-button>
<elf-button>Send<elf-icon slot="suffix-icon" name="send"></elf-icon></elf-button>
<elf-button direction="vertical"><elf-icon slot="icon" name="upload"></elf-icon>Upload file</elf-button>
<elf-button block>Create project</elf-button>
</elf-icon-provider>`;

const shapeScript = `import { mdiCogOutline, mdiDownload, mdiRefresh, mdiSend, mdiUpload } from "@mdi/js";
import { createSvgIconSet } from "@elfui/kit";

const buttonIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      cog: mdiCogOutline,
      download: mdiDownload,
      refresh: mdiRefresh,
      send: mdiSend,
      upload: mdiUpload
    })
  }
};`;

defineStyle(styles);

const PageButtonEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${shapeCode} :script=${shapeScript}>
    <span slot="status" class="button-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${buttonIconOptions}><div class="button-feature-grid">
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
          <elf-button circle :aria-label=${t("refresh")}><elf-icon slot="icon" name="refresh" size="18"></elf-icon></elf-button>
          <elf-button
            shape="square"
            variant="outlined"
            :aria-label=${t("settings")}
          ><elf-icon slot="icon" name="cog" size="18"></elf-icon></elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>${t("icons")}</strong>
        <div class="button-demo-row">
          <elf-button><elf-icon slot="icon" name="download" size="18"></elf-icon>${t("download")}</elf-button>
          <elf-button color="success">${t("send")}<elf-icon slot="suffix-icon" name="send" size="18"></elf-icon></elf-button>
          <elf-button direction="vertical" variant="outlined"><elf-icon slot="icon" name="upload" size="18"></elf-icon>${t("upload")}</elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>Block</strong>
        <elf-button block>${t("block")}</elf-button>
      </article>
    </div></elf-icon-provider>
  </elf-playground>
`);

export { PageButtonEx2 };
