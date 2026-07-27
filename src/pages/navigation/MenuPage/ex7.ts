import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "唯一展开", en: "Unique opened group" },
  title: { zh: "展开当前分组时关闭其他分组", en: "Opening one group closes the others" },
  current: { zh: "当前选中", en: "Selected" },
  defaultOpened: { zh: "默认展开", en: "Initially opened" },
  opened: { zh: "当前展开", en: "Opened" }
});


const active = useRef("analytics/realtime");

const openedText = useRef("");
const openedStatus = (): string => openedText.value || `${t("defaultOpened")}: Analytics`;

const items = [
    {
        index: "analytics",
        label: "Analytics",
        icon: "A",
        children: [
            { index: "analytics/realtime", label: "Realtime" },
            { index: "analytics/cohort", label: "Cohort" },
        ],
    },
    {
        index: "workspace",
        label: "Workspace",
        icon: "W",
        children: [
            { index: "workspace/projects", label: "Projects" },
            { index: "workspace/tasks", label: "Tasks" },
        ],
    },
    {
        index: "settings",
        label: "Settings",
        icon: "S",
        children: [
            { index: "settings/profile", label: "Profile" },
            { index: "settings/security", label: "Security" },
        ],
    },
];

const onOpen = (event: CustomEvent): void => {
    openedText.set(`${t("opened")}: ${String(event.detail[0])}`);
};

const onSelect = (event: CustomEvent): void => {
    active.set(String(event.detail));
};

const code = `<elf-menu
  :items.prop="items"
  :modelValue="active"
  :defaultOpeneds.prop="['analytics']"
  unique-opened
  @open="onOpen"
/>`;

const script = `const active = useRef("analytics/realtime");
const items = [
  { index: "analytics", label: "Analytics", children: [
    { index: "analytics/realtime", label: "Realtime" },
    { index: "analytics/cohort", label: "Cohort" }
  ] }
];
const onSelect = (event) => active.set(event.detail);

const t = createDocsTranslator({
    section: { zh: "唯一展开", en: "Unique opened group" },
    title: { zh: "展开当前分组时关闭其他分组", en: "Opening one group closes the others" },
    current: { zh: "当前选中", en: "Selected" },
    defaultOpened: { zh: "默认展开", en: "Initially opened" },
    opened: { zh: "当前展开", en: "Opened" }
});
const openedText = useRef("");
const onOpen = (event) => {
    openedText.set(\`\${t("opened")}: \${String(event.detail[0])}\`);
};`;

const PageMenuEx7 = defineHtml(`
    <h2>${t("section")}</h2>
    <elf-playground :title=${t("title")} :code=${code} :script=${script}>
        <span slot="status" class="demo-state">${openedStatus()} · ${t("current")}: {{ active }}</span>
        <div style="width:100%;max-width:320px">
            <elf-menu
                bordered
                :items.prop=${items}
                :modelValue.prop=${active.value}
                :defaultOpeneds.prop=${["analytics"]}
                unique-opened
                @open="onOpen"
                @update:modelValue="onSelect"
            ></elf-menu>
        </div>
    </elf-playground>
`);

export { PageMenuEx7 };
