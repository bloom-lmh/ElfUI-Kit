import { defineHtml, useRef } from "@elfui/core";


const checked = useRef<string[]>(["dashboard:view", "user:list"]);

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

const onChecked = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) checked.set(detail);
};

const checkedText = (): string => checked.value.join(", ") || "无";

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
  <h2>权限树</h2>
  <elf-playground title="常见后台权限配置：回显、勾选、禁用危险权限" :code="code" :script=${script}>
    <div slot="status" class="demo-actions" style="display:inline-flex;align-items:center;gap:6px">
      <span class="demo-state">权限 keys：{{ checkedText() }}</span>
      <elf-button size="small" variant="text" @click="selectAdmin()">管理员模板</elf-button>
      <elf-button size="small" variant="text" @click="clear()">清空</elf-button>
    </div>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
      :data.prop="permissions"
      node-key="id"
      :props.prop="{ label: 'title' }"
      :checkedKeys.prop="checked"
      @update:checkedKeys="onChecked"
      show-checkbox
      default-expand-all
      ></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx3 };
