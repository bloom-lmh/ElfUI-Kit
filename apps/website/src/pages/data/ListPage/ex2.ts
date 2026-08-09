import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { mdiArchiveOutline, mdiCodeTags, mdiHeadset, mdiPaletteOutline } from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface ChannelItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  disabled?: boolean;
}

const t = createDocsTranslator({
  title: { zh: "受控选择与键盘", en: "Controlled selection and keyboard" },
  selected: { zh: "当前频道", en: "Current channel" },
  clear: { zh: "清除", en: "Clear" },
  keyboard: {
    zh: "使用 ↑ ↓、Home、End 移动焦点，Enter 或 Space 选择",
    en: "Use ↑ ↓, Home, End to move; Enter or Space to select",
  },
  design: { zh: "设计系统", en: "Design system" },
  designSub: { zh: "组件规范与视觉令牌", en: "Component guidelines and visual tokens" },
  engineering: { zh: "工程协作", en: "Engineering" },
  engineeringSub: { zh: "构建、测试与发布状态", en: "Build, test, and release status" },
  archive: { zh: "历史归档", en: "Archive" },
  archiveSub: { zh: "只读频道，暂不可选择", en: "Read-only and currently unavailable" },
  support: { zh: "用户支持", en: "Customer support" },
  supportSub: { zh: "问题反馈与服务状态", en: "Feedback and service status" },
  region: { zh: "工作频道", en: "Workspace channels" },
});

const channels = (): ChannelItem[] => [
  { id: "design", icon: "palette", title: t("design"), subtitle: t("designSub") },
  { id: "engineering", icon: "code", title: t("engineering"), subtitle: t("engineeringSub") },
  {
    id: "archive",
    icon: "archive",
    title: t("archive"),
    subtitle: t("archiveSub"),
    disabled: true,
  },
  { id: "support", icon: "support", title: t("support"), subtitle: t("supportSub") },
];

const listIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      palette: mdiPaletteOutline,
      code: mdiCodeTags,
      archive: mdiArchiveOutline,
      support: mdiHeadset,
    }),
  },
};

// State
const selected = useRef("design");

// Derived state
const selectedLabel = (): string =>
  channels().find((item) => item.id === selected.value)?.title || "—";

// Methods
const onSelect = (event: CustomEvent<string>): void => selected.set(String(event.detail));
const clear = (): void => selected.set("");

const code = `<elf-icon-provider :options.prop="listIconOptions">
  <elf-list aria-label="工作频道" bordered>
    <elf-list-item
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.title"
      :subtitle="channel.subtitle"
      :value="channel.id"
      :active="selected === channel.id"
      :disabled="channel.disabled"
      clickable
      @select="onSelect"
    >
      <elf-icon slot="leading" :name.prop="channel.icon" size="20" />
    </elf-list-item>
  </elf-list>
</elf-icon-provider>`;

const script = `import { mdiArchiveOutline, mdiCodeTags, mdiHeadset, mdiPaletteOutline } from "@mdi/js";
import { createSvgIconSet } from "@elfui/kit";

const listIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      palette: mdiPaletteOutline,
      code: mdiCodeTags,
      archive: mdiArchiveOutline,
      support: mdiHeadset
    })
  }
};

const selected = useRef("design");

const onSelect = (event) => {
  selected.set(event.detail);
};

// ArrowUp / ArrowDown / Home / End move focus.
// Native Enter and Space activate the focused item.`;

defineStyle(styles);

const PageListEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="list-demo-actions">
      <span role="status" aria-live="polite">${t("selected")} · ${selectedLabel()}</span>
      <button type="button" @click=${clear}>${t("clear")}</button>
    </div>

    <elf-icon-provider :options.prop=${listIconOptions}>
      <section class="list-selection-card">
        <p class="list-keyboard-hint"><kbd>↑</kbd><kbd>↓</kbd><kbd>Home</kbd><kbd>End</kbd>${t("keyboard")}</p>
        <elf-list :ariaLabel.prop=${t("region")} bordered>
        <elf-list-item
          v-for="channel in channels()"
          :key="channel.id"
          :title="channel.title"
          :subtitle="channel.subtitle"
          :value="channel.id"
          :active="selected.value === channel.id"
          :disabled="channel.disabled"
          clickable
          @select=${onSelect}
        >
            <span slot="leading" class="list-channel-icon"><elf-icon :name="channel.icon" size="20"></elf-icon></span>
            <span v-if="selected.value === channel.id" slot="trailing" class="list-selected-mark" aria-hidden="true">✓</span>
          </elf-list-item>
        </elf-list>
      </section>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageListEx2 };
