import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "锚定浮层与视口碰撞", en: "Anchored overlay and viewport collision" },
  title: { zh: "top layer / offset / flip / preventOverflow", en: "Top layer / offset / flip / preventOverflow" },
  waiting: { zh: "等待选择", en: "Waiting for selection" },
  detail: { zh: "查看详情", en: "View details" },
  copy: { zh: "复制链接", en: "Copy link" },
  archive: { zh: "移到归档", en: "Move to archive" },
  action: { zh: "执行", en: "Action" },
  clippedActions: { zh: "受裁切容器内的操作", en: "Actions inside a clipped container" },
});

const lastAction = useRef(t("waiting"));

const items = [
  { label: t("detail"), command: "detail" },
  { label: t("copy"), command: "copy" },
  { label: t("archive"), command: "archive", divided: true }
];

const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 10] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } }
  ]
};

const onCommand = (event: CustomEvent): void => {
  lastAction.set(`${t("action")}: ${String(event.detail.command)}`);
};

const code = `<elf-dropdown
  :items=\${items}
  label="${t("clippedActions")}"
  teleported
  append-to="body"
  placement="bottom-end"
  :popperOptions=\${popperOptions}
  @command="onCommand"
/>`;

const script = `const lastAction = useRef("${t("waiting")}");
const items = [
    { label: "${t("detail")}", command: "detail" },
    { label: "${t("copy")}", command: "copy" },
    { label: "${t("archive")}", command: "archive", divided: true }
];
const popperOptions = {
    modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "flip", enabled: true },
        { name: "preventOverflow", options: { padding: 12 } }
    ]
};
const onCommand = (event) => {
    lastAction.set(\`${t("action")}: \${String(event.detail.command)}\`);
};`;

const PageDropdownEx6 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">{{ lastAction }}</span>
    <div
      style="width:min(100%,520px);height:150px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:12px;padding:18px;box-sizing:border-box;display:flex;justify-content:flex-end;align-items:flex-end"
    >
      <elf-dropdown
        :items=${items}
        :label=${t("clippedActions")}
        teleported
        append-to="body"
        placement="bottom-end"
        :popperOptions=${popperOptions}
        @command=${onCommand}
      ></elf-dropdown>
    </div>
  </elf-playground>
`);

export { PageDropdownEx6 };
