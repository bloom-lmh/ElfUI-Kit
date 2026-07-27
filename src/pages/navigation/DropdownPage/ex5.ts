import { defineHtml, onMounted, useHost, useRef } from "@elfui/core";

interface VirtualDropdownElement extends HTMLElement {
  virtualRef?: HTMLElement | null;
}

const selectedLabel = useRef("未选择");
const selectedCommand = useRef("-");
const host = useHost();

const onCommand = (event: CustomEvent): void => {
  selectedCommand.set(String(event.detail?.command ?? "-"));
  selectedLabel.set(String(event.detail?.item?.label ?? event.detail?.command ?? "未选择"));
};

const compositionalCode = `<elf-dropdown trigger="click" @command=\${onCommand}>
  <span>账户操作：\${selectedLabel}</span>
  <elf-dropdown-menu slot="dropdown">
    <elf-dropdown-item command="profile">个人资料</elf-dropdown-item>
    <elf-dropdown-item command="security">安全设置</elf-dropdown-item>
    <elf-dropdown-item command="locked" disabled>锁定项</elf-dropdown-item>
    <elf-dropdown-item command="logout" divided>退出登录</elf-dropdown-item>
  </elf-dropdown-menu>
</elf-dropdown>`;

const compositionalScript = `const selectedLabel = useRef("未选择");
const selectedCommand = useRef("-");
const onCommand = (event) => {
    selectedCommand.set(String(event.detail?.command ?? "-"));
    selectedLabel.set(String(event.detail?.item?.label ?? event.detail?.command ?? "未选择"));
};`;

const virtualCode = `<button id="dropdown-virtual-trigger">右键此区域</button>
<elf-dropdown
  data-virtual-dropdown
  virtual-triggering
  trigger="contextmenu"
  :items=\${virtualItems}
/>`;

const virtualScript = `const host = useHost();

onMounted(() => {
  window.setTimeout(() => {
    const root = host.shadowRoot ?? host;
    const trigger = root.querySelector("#dropdown-virtual-trigger");
    const dropdown = root.querySelector("[data-virtual-dropdown]");
    dropdown.virtualRef = trigger;
  }, 0);
});

const virtualItems = [
    { label: "刷新画布", command: "refresh" },
    { label: "复制坐标", command: "copy-position" },
    { label: "删除节点", command: "delete", divided: true }
];`;

const virtualItems = [
  { label: "刷新画布", command: "refresh" },
  { label: "复制坐标", command: "copy-position" },
  { label: "删除节点", command: "delete", divided: true }
];

onMounted(() => {
  window.setTimeout(() => {
    const root = host.shadowRoot ?? host;
    const trigger = root.querySelector<HTMLElement>("#dropdown-virtual-trigger");
    const dropdown = root.querySelector<VirtualDropdownElement>("[data-virtual-dropdown]");
    if (dropdown) dropdown.virtualRef = trigger;
  }, 0);
});

const PageDropdownEx5 = defineHtml(`
  <elf-playground title="组合式菜单与选中反馈" :code=${compositionalCode} :script=${compositionalScript}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <elf-dropdown trigger="click" @command=${onCommand}>
        <span>账户操作：{{ selectedLabel }}</span>
        <elf-dropdown-menu slot="dropdown">
          <elf-dropdown-item command="profile">
            <svg slot="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.8" />
              <path d="M4.5 16c.7-3 2.5-4.5 5.5-4.5s4.8 1.5 5.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            个人资料
          </elf-dropdown-item>
          <elf-dropdown-item command="security">安全设置</elf-dropdown-item>
          <elf-dropdown-item command="locked" disabled>锁定项</elf-dropdown-item>
          <elf-dropdown-item command="logout" divided>退出登录</elf-dropdown-item>
        </elf-dropdown-menu>
      </elf-dropdown>
      <span class="demo-state">当前命令：<strong>{{ selectedCommand }}</strong></span>
    </div>
  </elf-playground>

  <elf-playground title="虚拟触发" :code=${virtualCode} :script=${virtualScript}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <button
        id="dropdown-virtual-trigger"
        type="button"
        style="min-width:220px;min-height:96px;border:1px dashed var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);color:var(--elf-text-secondary)"
      >
        在此区域右键打开菜单
      </button>
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
