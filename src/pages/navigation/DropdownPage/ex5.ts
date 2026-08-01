import { defineHtml, onMounted, useHost, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

interface VirtualDropdownElement extends HTMLElement {
  virtualRef?: HTMLElement | null;
}

const t = createDocsTranslator({
  compositionalTitle: { zh: "组合式菜单与选中反馈", en: "Compositional menu and selected state" },
  virtualTitle: { zh: "虚拟触发", en: "Virtual trigger" },
  accountActions: { zh: "账户操作", en: "Account actions" },
  profile: { zh: "个人资料", en: "Profile" },
  security: { zh: "安全设置", en: "Security settings" },
  locked: { zh: "锁定项", en: "Locked item" },
  logout: { zh: "退出登录", en: "Sign out" },
  currentCommand: { zh: "当前命令", en: "Current command" },
  notSelected: { zh: "未选择", en: "No selection" },
  rightClick: { zh: "在此区域右键打开菜单", en: "Right-click this area to open the menu" },
  refreshCanvas: { zh: "刷新画布", en: "Refresh canvas" },
  copyPosition: { zh: "复制坐标", en: "Copy coordinates" },
  deleteNode: { zh: "删除节点", en: "Delete node" },
});

const selectedLabel = useRef(t("notSelected"));
const selectedCommand = useRef("-");
const host = useHost();

const onCommand = (event: CustomEvent): void => {
  selectedCommand.set(String(event.detail?.command ?? "-"));
  selectedLabel.set(String(event.detail?.item?.label ?? event.detail?.command ?? t("notSelected")));
};

const compositionalCode = `<elf-dropdown trigger="click" @command=\${onCommand}>
  <span>${t("accountActions")}: \${selectedLabel}</span>
  <elf-dropdown-menu slot="dropdown">
    <elf-dropdown-item command="profile">${t("profile")}</elf-dropdown-item>
    <elf-dropdown-item command="security">${t("security")}</elf-dropdown-item>
    <elf-dropdown-item command="locked" disabled>${t("locked")}</elf-dropdown-item>
    <elf-dropdown-item command="logout" divided>${t("logout")}</elf-dropdown-item>
  </elf-dropdown-menu>
</elf-dropdown>`;

const compositionalScript = `const selectedLabel = useRef("${t("notSelected")}");
const selectedCommand = useRef("-");
const onCommand = (event) => {
    selectedCommand.set(String(event.detail?.command ?? "-"));
    selectedLabel.set(String(event.detail?.item?.label ?? event.detail?.command ?? "${t("notSelected")}"));
};`;

const virtualCode = `<elf-input id="dropdown-virtual-trigger" readonly variant="outlined" model-value="${t("rightClick")}" />
<elf-dropdown
  data-virtual-dropdown
  virtual-triggering
  trigger="contextmenu"
  :items=\${virtualItems}
/>`;

const virtualScript = `const host = useHost();

onMounted(() => {
  const root = host.shadowRoot ?? host;
  const trigger = root.querySelector("#dropdown-virtual-trigger");
  const dropdown = root.querySelector("[data-virtual-dropdown]");
  dropdown.virtualRef = trigger;
});

const virtualItems = [
    { label: "${t("refreshCanvas")}", command: "refresh" },
    { label: "${t("copyPosition")}", command: "copy-position" },
    { label: "${t("deleteNode")}", command: "delete", divided: true }
];`;

const virtualItems = [
  { label: t("refreshCanvas"), command: "refresh" },
  { label: t("copyPosition"), command: "copy-position" },
  { label: t("deleteNode"), command: "delete", divided: true },
];

onMounted(() => {
  const root = host.shadowRoot ?? host;
  const trigger = root.querySelector<HTMLElement>("#dropdown-virtual-trigger");
  const dropdown = root.querySelector<VirtualDropdownElement>("[data-virtual-dropdown]");
  if (dropdown) dropdown.virtualRef = trigger;
});

const PageDropdownEx5 = defineHtml(`
  <elf-playground :title=${t("compositionalTitle")} :code=${compositionalCode} :script=${compositionalScript}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <elf-dropdown trigger="click" @command=${onCommand}>
        <span>${t("accountActions")}: {{ selectedLabel }}</span>
        <elf-dropdown-menu slot="dropdown">
          <elf-dropdown-item command="profile">
            <svg slot="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M4.5 16c.7-3 2.5-4.5 5.5-4.5s4.8 1.5 5.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            ${t("profile")}
          </elf-dropdown-item>
          <elf-dropdown-item command="security">${t("security")}</elf-dropdown-item>
          <elf-dropdown-item command="locked" disabled>${t("locked")}</elf-dropdown-item>
          <elf-dropdown-item command="logout" divided>${t("logout")}</elf-dropdown-item>
        </elf-dropdown-menu>
      </elf-dropdown>
      <span class="demo-state">${t("currentCommand")}: <strong>{{ selectedCommand }}</strong></span>
    </div>
  </elf-playground>

  <elf-playground :title=${t("virtualTitle")} :code=${virtualCode} :script=${virtualScript}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <elf-input
        id="dropdown-virtual-trigger"
        readonly
        variant="outlined"
        :modelValue=${t("rightClick")}
        style="width:min(100%,300px)"
      ></elf-input>
      <elf-dropdown
        data-virtual-dropdown
        virtual-triggering
        trigger="contextmenu"
        :items=${virtualItems}
        @command=${onCommand}
      ></elf-dropdown>
    </div>
  </elf-playground>
`);

export { PageDropdownEx5 };
