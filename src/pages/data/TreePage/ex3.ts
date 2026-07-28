import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const checked = useRef<string[]>(["dashboard:view", "user:list"]);

const t = createDocsTranslator({
  title: { zh: "权限配置", en: "Permission editor" },
  keys: { zh: "权限键", en: "Permission keys" },
  none: { zh: "无", en: "None" },
  admin: { zh: "管理员模板", en: "Admin preset" },
  clear: { zh: "清空", en: "Clear" },
  dashboard: { zh: "工作台", en: "Dashboard" },
  dashboardView: { zh: "查看概览", en: "View overview" },
  dashboardExport: { zh: "导出报表", en: "Export reports" },
  system: { zh: "系统管理", en: "System" },
  users: { zh: "用户管理", en: "Users" },
  userList: { zh: "查看用户", en: "View users" },
  userCreate: { zh: "创建用户", en: "Create users" },
  userDelete: { zh: "删除用户", en: "Delete users" },
  roles: { zh: "角色管理", en: "Roles" },
  roleList: { zh: "查看角色", en: "View roles" },
  roleAssign: { zh: "分配权限", en: "Assign permissions" },
  aria: { zh: "角色权限树", en: "Role permission tree" }
});

const permissions = () => [
  {
    id: "dashboard",
    title: t("dashboard"),
    children: [
      { id: "dashboard:view", title: t("dashboardView") },
      { id: "dashboard:export", title: t("dashboardExport") }
    ]
  },
  {
    id: "system",
    title: t("system"),
    children: [
      {
        id: "user",
        title: t("users"),
        children: [
          { id: "user:list", title: t("userList") },
          { id: "user:create", title: t("userCreate") },
          { id: "user:delete", title: t("userDelete"), disabled: true }
        ]
      },
      {
        id: "role",
        title: t("roles"),
        children: [
          { id: "role:list", title: t("roleList") },
          { id: "role:assign", title: t("roleAssign") }
        ]
      }
    ]
  }
];

const onChecked = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) checked.set(detail);
};

const checkedText = (): string => checked.value.join(", ") || t("none");

const selectAdmin = (): void => {
  checked.set([
    "dashboard:view",
    "dashboard:export",
    "user:list",
    "user:create",
    "role:list",
    "role:assign"
  ]);
};

const clear = (): void => {
  checked.set([]);
};

const code = `<elf-tree
  :data.prop="permissions"
  node-key="id"
  :props.prop="{ label: 'title' }"
  :checkedKeys.prop="checked"
  @update:checkedKeys="onChecked"
  show-checkbox
  default-expand-all
/>`;

const script = `const checked = useRef(["dashboard:view", "user:list"]);
const permissions = [
    {
        id: "dashboard",
        title: "工作台",
        children: [
            { id: "dashboard:view", title: "查看概览" },
            { id: "dashboard:export", title: "导出报表" }
        ]
    },
    {
        id: "system",
        title: "系统管理",
        children: [
            {
                id: "user",
                title: "用户管理",
                children: [
                    { id: "user:list", title: "查看用户" },
                    { id: "user:create", title: "创建用户" },
                    { id: "user:delete", title: "删除用户", disabled: true }
                ]
            },
            {
                id: "role",
                title: "角色管理",
                children: [
                    { id: "role:list", title: "查看角色" },
                    { id: "role:assign", title: "分配权限" }
                ]
            }
        ]
    }
];
const onChecked = (event) => {
    const detail = event.detail;
    if (Array.isArray(detail))
        checked.set(detail);
};`;

const PageTreeEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="demo-actions" style="display:inline-flex;align-items:center;gap:6px">
      <span class="demo-state">${t("keys")} · ${checkedText()}</span>
      <elf-button size="small" variant="text" @click=${selectAdmin}>${t("admin")}</elf-button>
      <elf-button size="small" variant="text" @click=${clear}>${t("clear")}</elf-button>
    </div>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${permissions()}
        node-key="id"
        :props.prop=${{ label: "title" }}
        :checkedKeys.prop=${checked}
        :ariaLabel.prop=${t("aria")}
        show-checkbox
        default-expand-all
        @update:checkedKeys=${onChecked}
      />
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx3 };
