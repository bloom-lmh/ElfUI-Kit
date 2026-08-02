import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "组合式菜单", en: "Compositional menu" },
  waiting: { zh: "等待操作", en: "Waiting for action" },
  selected: { zh: "已选择", en: "Selected" },
  current: { zh: "当前", en: "Current" },
  workspace: { zh: "工作台", en: "Workspace" },
  delivery: { zh: "交付管理", en: "Delivery" },
  projects: { zh: "项目", en: "Projects" },
  releases: { zh: "发布", en: "Releases" },
  archive: { zh: "归档", en: "Archive" },
  settings: { zh: "设置", en: "Settings" },
});

const active = useRef("workspace/projects");
const lastAction = useRef("");
const actionText = (): string => lastAction.value || t("waiting");

const onSelect = (event: CustomEvent): void => {
  active.set(String(event.detail));
  lastAction.set(`${t("selected")} ${String(event.detail)}`);
};

const onItemClick = (event: CustomEvent): void => {
  lastAction.set(`MenuItem click：${event.detail.index}`);
};

const code = `<elf-menu
  :modelValue=\${active}
  :defaultOpeneds=\${["workspace"]}
  @update:modelValue="onSelect"
>
  <elf-sub-menu
    index="workspace"
    title="Workspace"
    icon="W"
    expand-close-icon="＋"
    expand-open-icon="−"
  >
    <elf-menu-item-group title="Delivery">
      <elf-menu-item index="workspace/projects" title="Projects" @click="onItemClick" />
      <elf-menu-item index="workspace/releases" title="Releases" />
    </elf-menu-item-group>
    <elf-menu-item index="workspace/archive" title="Archive" disabled />
  </elf-sub-menu>
  <elf-menu-item index="settings" title="Settings" icon="S" />
</elf-menu>`;

const script = `const active = useRef("workspace/projects");
const lastAction = useRef("Waiting for action");
const onSelect = (event) => {
  active.set(event.detail);
  lastAction.set(\`Selected \${event.detail}\`);
};

const onItemClick = (event) => {
    lastAction.set(\`MenuItem click：\${event.detail.index}\`);
};`;

const PageMenuEx8 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground title="SubMenu / MenuItem / MenuItemGroup" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${actionText()} · ${t("current")}: {{ active }}</span>
    <elf-menu
      bordered
      rounded
      :modelValue.prop=${active.value}
      :defaultOpeneds.prop=${["workspace"]}
      @update:modelValue=${onSelect}
      style="height:360px"
    >
      <elf-sub-menu
        index="workspace"
        :title=${t("workspace")}
        icon="W"
        expand-close-icon="＋"
        expand-open-icon="−"
      >
        <elf-menu-item-group :title=${t("delivery")}>
          <elf-menu-item
            index="workspace/projects"
            :title=${t("projects")}
            :route=${{ path: "/projects" }}
            @click=${onItemClick}
          ></elf-menu-item>
          <elf-menu-item index="workspace/releases" :title=${t("releases")}></elf-menu-item>
        </elf-menu-item-group>
        <elf-menu-item index="workspace/archive" :title=${t("archive")} disabled></elf-menu-item>
      </elf-sub-menu>
      <elf-menu-item index="settings" :title=${t("settings")} icon="S"></elf-menu-item>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx8 };
