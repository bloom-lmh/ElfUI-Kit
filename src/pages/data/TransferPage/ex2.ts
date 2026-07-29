import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "过滤、默认值与目标排序", en: "Filter, defaults, and target ordering" },
  playground: { zh: "自定义字段、禁用项、过滤方法与前置排序", en: "Custom fields, disabled items, custom filtering, and unshift ordering" },
  remove: { zh: "移除", en: "Remove" },
  add: { zh: "添加", en: "Add" },
  users: { zh: "位用户", en: " users" },
  selected: { zh: "已选", en: " selected" }
});

const users = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Bruno" },
  { id: "u3", name: "Chi" },
  { id: "u4", name: "Dora", locked: true },
  { id: "u5", name: "Evan" }
];

const selected = useRef<string[]>(["u2"]);
const readKeys = (event: Event): string[] => (Array.isArray((event as CustomEvent).detail) ? (event as CustomEvent).detail : []);
const onTransfer = (event: Event): void => selected.set(readKeys(event));
const filterUsers = (query: string, user: { name: string }): boolean => user.name.toLowerCase().startsWith(query.toLowerCase());

const code = `const selected = useRef(["u2"])
<elf-transfer
  :data="users"
  :modelValue="selected"
  @update:modelValue="onTransfer"
  :props="{ key: 'id', label: 'name', disabled: 'locked' }"
  filterable
  :filterMethod="filterUsers"
  target-order="unshift"
  :leftDefaultChecked="['u1']"
  :buttonTexts="['${t("remove")}', '${t("add")}']"
  :format="format"
/>`;

const script = `const users = [
    { id: "u1", name: "Ada" },
    { id: "u2", name: "Bruno" },
    { id: "u3", name: "Chi" },
    { id: "u4", name: "Dora", locked: true },
    { id: "u5", name: "Evan" }
];
const selected = useRef(["u2"]);
const readKeys = (event) => (Array.isArray(event.detail) ? event.detail : []);
const onTransfer = (event) => selected.set(readKeys(event));
const filterUsers = (query, user) => user.name.toLowerCase().startsWith(query.toLowerCase());
const format = {
  noChecked: "\${total}${t("users")}",
  hasChecked: "\${checked}/\${total} ${t("selected")}"
};`;

const noCheckedFormat = `\${total}${t("users")}`;
const hasCheckedFormat = `\${checked}/\${total} ${t("selected")}`;

const PageTransferEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <elf-transfer
      :data.prop=${users}
      :modelValue.prop=${selected.value}
      @update:modelValue=${onTransfer}
      :props.prop=${{ key: "id", label: "name", disabled: "locked" }}
      filterable
      :filterMethod=${filterUsers}
      target-order="unshift"
      :leftDefaultChecked.prop=${["u1"]}
      :buttonTexts.prop=${[t("remove"), t("add")]}
      :format.prop=${{ noChecked: noCheckedFormat, hasChecked: hasCheckedFormat }}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx2 };
