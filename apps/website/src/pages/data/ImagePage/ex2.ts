import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "加载失败与重试", en: "Load failure and retry" },
  waiting: { zh: "等待错误响应", en: "Waiting for error response" },
  failed: { zh: "资源不可用", en: "Resource unavailable" },
  recovered: { zh: "重试成功", en: "Retry succeeded" },
  reset: { zh: "重新触发失败", en: "Trigger failure again" },
  failedTitle: { zh: "封面加载失败", en: "Cover failed to load" },
  failedHint: {
    zh: "刷新签名地址后可再次请求原资源。",
    en: "Refresh the signed URL before requesting the resource again.",
  },
  retry: { zh: "重试加载", en: "Retry loading" },
  controls: { zh: "资源控制", en: "Source controls" },
  sourceState: { zh: "资源状态", en: "Source state" },
  errorSource: { zh: "加载失败", en: "Load error" },
  validSource: { zh: "恢复成功", en: "Recovered" },
  alt: { zh: "恢复后的项目封面", en: "Recovered project cover" },
});

const recoveredSource =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1040&h=560&q=80";

// State
const source = useRef("/missing-image-retry.svg");
const failed = useRef(false);
const loaded = useRef(false);
const attempt = useRef(0);
const sourceState = useRef("error");

// Derived state
const statusText = (): string =>
  loaded.value ? t("recovered") : failed.value ? t("failed") : t("waiting");

// Methods
const onError = (): void => {
  failed.set(true);
  loaded.set(false);
};

const onLoad = (): void => {
  failed.set(false);
  loaded.set(true);
};

const retryImage = (): void => {
  attempt.set(attempt.value + 1);
  failed.set(false);
  loaded.set(false);
  source.set(`${recoveredSource}#retry-${attempt.value}`);
  sourceState.set("recovered");
};

const resetFailure = (): void => {
  attempt.set(attempt.value + 1);
  failed.set(false);
  loaded.set(false);
  source.set(`/missing-image-retry.svg?attempt=${attempt.value}`);
  sourceState.set("error");
};

const sourceOptions = () => [
  { label: t("errorSource"), value: "error" },
  { label: t("validSource"), value: "recovered" },
];
const onSourceState = (event: CustomEvent): void => {
  const value = String(Array.isArray(event.detail) ? event.detail[0] : event.detail);
  if (value === "recovered") retryImage();
  else resetFailure();
};

const retryCode = `<elf-image
  :src=\${source}
  alt="Project cover"
  width="520"
  height="280"
  fit="cover"
  @load=\${onLoad}
  @error=\${onError}
>
  <div slot="error">
    <strong>Cover failed to load</strong>
    <span>Refresh the signed URL, then retry.</span>
    <elf-button @click=\${retryImage}>Retry loading</elf-button>
  </div>
</elf-image>`;

const retryScript = `const source = useRef("/api/assets/project-cover");
const failed = useRef(false);

const onError = () => failed.set(true);
const onLoad = () => failed.set(false);

const retryImage = async () => {
  // Refresh an expired or signed source before updating src.
  source.set(await requestFreshAssetUrl());
};`;

defineStyle(styles);

const PageImageEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${retryCode} :script=${retryScript}>
    <div slot="status" class="image-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" class="image-demo-command" @click=${resetFailure}>
        ${t("reset")}
      </button>
    </div>
    <div class="image-retry-stage">
      <elf-image
        :src=${source.value}
        :alt=${t("alt")}
        width="520"
        height="280"
        fit="cover"
        @load=${onLoad}
        @error=${onError}
      >
        <div slot="error" class="image-retry-error">
          <span class="image-retry-mark" aria-hidden="true">!</span>
          <strong>${t("failedTitle")}</strong>
          <span>${t("failedHint")}</span>
          <elf-button size="sm" type="primary" @click=${retryImage}>
            ${t("retry")}
          </elf-button>
        </div>
      </elf-image>
    </div>
    <aside slot="controls" class="image-demo-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><elf-select variant="outlined" :label=${t("sourceState")} :options.prop=${sourceOptions()} :modelValue.prop=${sourceState.value} @update:modelValue=${onSourceState}></elf-select></label>
      <elf-button size="sm" variant="outlined" @click=${resetFailure}>${t("reset")}</elf-button>
      <elf-button size="sm" @click=${retryImage}>${t("retry")}</elf-button>
    </aside>
  </elf-playground>
`);

export { PageImageEx2 };
