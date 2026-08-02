import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { UploadElement } from "@elfui/kit-src/components/Form";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  playgroundTitle: { zh: "Vuetify 风格文件上传", en: "Vuetify-style file upload" },
  drop: { zh: "将文件拖放到这里", en: "Drag and drop files here" },
  or: { zh: "或", en: "or" },
  browse: { zh: "浏览文件", en: "Browse Files" },
  idle: { zh: "等待拖入或选择文件", en: "Drop or choose files" },
  selected: { zh: "已加入文件", en: "Files added" },
});

const uploadStatus = useRef(t("idle"));
const onChange = (event: CustomEvent<unknown[]>): void => {
  uploadStatus.set(`${t("selected")}: ${event.detail?.length ?? 0}`);
};
const selectFiles = (event: Event): void => {
  event.stopPropagation();
  (event.currentTarget as HTMLElement).closest<UploadElement>("elf-upload")?.select();
};

const code = (): string => `<elf-upload drag multiple @change=\${onChange}>
  <div slot="dropzone">
    ${t("drop")} · ${t("or")} · <button @click=\${selectFiles}>${t("browse")}</button>
  </div>
</elf-upload>`;
const script = (): string => `const uploadStatus = useRef("${t("idle")}");
const onChange = (event) => uploadStatus.set(\`${t("selected")}: \${event.detail?.length ?? 0}\`);
const selectFiles = (event) => event.currentTarget.closest("elf-upload")?.select();`;

defineStyle(styles);

const PageUploadEx9 = defineHtml(`
  <elf-playground :title=${t("playgroundTitle")} :code=${code()} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${uploadStatus.value}</span>
    <div class="upload-demo-stage is-large">
      <elf-upload class="vuetify-file-upload" drag multiple @change=${onChange}>
        <div slot="dropzone" class="upload-drop-content">
          <span class="upload-drop-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5"></path>
            </svg>
          </span>
          <strong class="upload-drop-title">${t("drop")}</strong>
          <span class="upload-drop-or">${t("or")}</span>
          <button class="upload-browse" type="button" @click=${selectFiles}>
            ${t("browse")}
          </button>
        </div>
      </elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx9 };
