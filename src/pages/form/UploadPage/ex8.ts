import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { UploadElement, UploadFileItem } from "../../../components/Form";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "文件输入与选择标签", en: "File input with selection chips" },
  label: { zh: "文件输入", en: "File input" },
  placeholder: { zh: "上传你的文档", en: "Upload your documents" },
  selected: { zh: "已选择文件", en: "Selected files" },
});

const fileList = useRef<UploadFileItem[]>([
  {
    uid: "design",
    name: "design-system.pdf",
    size: 248000,
    type: "application/pdf",
    status: "ready",
    percentage: 0,
  },
]);

const updateFiles = (event: CustomEvent<UploadFileItem[]>): void =>
  fileList.set(event.detail || []);
const selectFiles = (event: Event): void =>
  (event.currentTarget as HTMLElement).closest<UploadElement>("elf-upload")?.select();
const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  selectFiles(event);
};
const statusText = (): string => `${t("selected")}: ${fileList.value.length}`;

const code = (): string => `<elf-upload
  multiple
  :fileList.prop=\${files}
  :showFileList.prop=\${false}
  @update:fileList=\${updateFiles}
>
  <div slot="trigger" class="file-input-field" role="button" tabindex="0">
    <svg aria-hidden="true">...</svg>
    <span>${t("placeholder")}</span>
  </div>
</elf-upload>`;
const script = (): string => `const files = useRef([]);
const updateFiles = (event) => files.set(event.detail || []);`;

defineStyle(styles);

const PageUploadEx8 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <div class="upload-demo-stage">
      <elf-upload
        class="vuetify-file-input"
        multiple
        :fileList.prop=${fileList.value}
        :showFileList.prop=${false}
        @update:fileList=${updateFiles}
      >
        <div
          slot="trigger"
          class="file-input-field"
          role="button"
          tabindex="0"
          :aria-label=${t("label")}
          @click=${selectFiles}
          @keydown=${onTriggerKeydown}
        >
          <span class="file-input-paperclip" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m20.5 11.5-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"></path>
            </svg>
          </span>
          <span class="file-input-content">
            <span v-if=${fileList.value.length === 0} class="file-input-placeholder">
              ${t("placeholder")}
            </span>
            <span v-for="file in fileList" :key="file.uid" class="file-input-chip">
              {{ file.name }}
            </span>
          </span>
        </div>
      </elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx8 };
