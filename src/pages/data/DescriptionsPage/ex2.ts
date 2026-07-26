import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type DemoDirection = "horizontal" | "vertical";
type DemoSize = "sm" | "" | "lg";

const t = createDocsTranslator({
  title: { zh: "边框、方向与密度", en: "Border, direction, and density" },
  account: { zh: "运行账户", en: "Runtime account" },
  direction: { zh: "方向", en: "Direction" },
  density: { zh: "密度", en: "Density" },
  horizontal: { zh: "水平", en: "Horizontal" },
  vertical: { zh: "垂直", en: "Vertical" },
  compact: { zh: "紧凑", en: "Compact" },
  defaultSize: { zh: "默认", en: "Default" },
  spacious: { zh: "宽松", en: "Spacious" },
  username: { zh: "用户名", en: "Username" },
  role: { zh: "角色", en: "Role" },
  region: { zh: "区域", en: "Region" },
  access: { zh: "最近访问", en: "Last access" },
  maintainer: { zh: "维护者", en: "Maintainer" }
});

// State
const direction = useRef<DemoDirection>("horizontal");
const size = useRef<DemoSize>("");

// Derived state
const accountItems = () => [
  { label: t("username"), value: "elf-admin" },
  { label: t("role"), value: t("maintainer") },
  { label: t("region"), value: "Asia Pacific · Shanghai" },
  { label: t("access"), value: "2026-07-26 20:42" }
];

const statusText = (): string =>
  `${direction.value === "vertical" ? t("vertical") : t("horizontal")} · ${
    size.value === "sm" ? t("compact") : size.value === "lg" ? t("spacious") : t("defaultSize")
  }`;

// Methods
const onStatusAction = (event: Event): void => {
  const target = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement &&
        Boolean(entry.dataset.direction || entry.dataset.size !== undefined)
    );
  if (!target) return;
  if (target.dataset.direction) {
    direction.set(target.dataset.direction as DemoDirection);
  }
  if (target.dataset.size !== undefined) {
    size.set(target.dataset.size as DemoSize);
  }
};

const variantsCode = `<elf-descriptions
  title="Runtime account"
  border
  :items.prop=\${accountItems}
  :column=\${2}
  :direction=\${direction}
  :size=\${size}
/>`;

const variantsScript = `const direction = useRef("horizontal");
const size = useRef("");

const setDirection = (next) => direction.set(next);
const setSize = (next) => size.set(next);`;

defineStyle(styles);

const PageDescriptionsEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${variantsCode} :script=${variantsScript}>
    <div
      slot="status"
      class="descriptions-demo-actions"
      @click=${onStatusAction}
    >
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" data-direction="horizontal">${t("horizontal")}</button>
      <button type="button" data-direction="vertical">${t("vertical")}</button>
      <button type="button" data-size="sm">${t("compact")}</button>
      <button type="button" data-size="">${t("defaultSize")}</button>
      <button type="button" data-size="lg">${t("spacious")}</button>
    </div>

    <div class="descriptions-standard-frame">
      <elf-descriptions
        :title=${t("account")}
        border
        :items.prop=${accountItems()}
        :column=${2}
        :direction=${direction}
        :size=${size}
      ></elf-descriptions>
    </div>
  </elf-playground>
`);

export { PageDescriptionsEx2 };
