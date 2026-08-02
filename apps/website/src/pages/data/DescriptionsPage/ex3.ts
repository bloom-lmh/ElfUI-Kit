import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "插槽操作与空集合", en: "Slot actions and empty collections" },
  profile: { zh: "环境档案", en: "Environment profile" },
  live: { zh: "在线", en: "Live" },
  hide: { zh: "隐藏详情", en: "Hide details" },
  restore: { zh: "恢复详情", en: "Restore details" },
  shown: { zh: "丰富内容已显示", en: "Rich content is visible" },
  hidden: { zh: "空集合插槽已显示", en: "The empty collection slot is visible" },
  region: { zh: "区域", en: "Region" },
  health: { zh: "健康度", en: "Health" },
  endpoint: { zh: "入口地址", en: "Endpoint" },
  owner: { zh: "值班负责人", en: "On-call owner" },
  healthy: { zh: "全部服务正常", en: "All services healthy" },
  noEnvironment: {
    zh: "尚未选择环境，请先从项目设置中绑定一个运行环境。",
    en: "No environment is selected. Bind one from project settings first.",
  },
});

// State
const showDetails = useRef(true);

// Derived state
const statusText = (): string => (showDetails.value ? t("shown") : t("hidden"));

// Methods
const toggleDetails = (): void => showDetails.set(!showDetails.value);

const slotsCode = `<elf-descriptions border :column=\${2}>
  <strong slot="title">Environment profile</strong>
  <button slot="extra" type="button" @click=\${toggleDetails}>
    Hide details
  </button>

  <elf-descriptions-item label="Region">Asia Pacific</elf-descriptions-item>
  <elf-descriptions-item>
    <span slot="label">Health</span>
    <span>All services healthy</span>
  </elf-descriptions-item>
  <elf-descriptions-item label="Endpoint" :span=\${2}>
    https://console.elfui.dev/environments/production
  </elf-descriptions-item>

  <div slot="empty">No environment is selected.</div>
</elf-descriptions>`;

const slotsScript = `const showDetails = useRef(true);
const toggleDetails = () => showDetails.set(!showDetails.value);

// title and extra slots create the header without requiring title/extra props.
// The empty slot renders when neither data items nor declarative items exist.`;

defineStyle(styles);

const PageDescriptionsEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${slotsCode} :script=${slotsScript}>
    <span slot="status" class="descriptions-demo-status" role="status" aria-live="polite">
      ${statusText()}
    </span>

    <div class="descriptions-standard-frame">
      <elf-descriptions border :column=${2}>
        <span slot="title" class="descriptions-slot-title">
          <span class="descriptions-live-dot" aria-hidden="true"></span>
          ${t("profile")}
        </span>
        <button
          slot="extra"
          class="descriptions-slot-action"
          type="button"
          @click=${toggleDetails}
        >
          ${showDetails.value ? t("hide") : t("restore")}
        </button>

        <template v-if=${showDetails}>
          <elf-descriptions-item :label=${t("region")}>
            Asia Pacific · Shanghai
          </elf-descriptions-item>
          <elf-descriptions-item>
            <span slot="label">${t("health")}</span>
            <span class="descriptions-health">${t("healthy")}</span>
          </elf-descriptions-item>
          <elf-descriptions-item :label=${t("endpoint")} :span=${2}>
            <a class="descriptions-endpoint" href="#/data/descriptions">
              https://console.elfui.dev/environments/production
            </a>
          </elf-descriptions-item>
          <elf-descriptions-item
            :label=${t("owner")}
            :span=${2}
            empty-text="—"
          />
        </template>

        <div slot="empty" class="descriptions-empty-state">
          <span aria-hidden="true">◇</span>
          <strong>${t("noEnvironment")}</strong>
        </div>
      </elf-descriptions>
    </div>
  </elf-playground>
`);

export { PageDescriptionsEx3 };
