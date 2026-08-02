import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  appearance: { zh: "外观", en: "Appearance" },
  appearanceTitle: {
    zh: "默认、内嵌、Material 与方形外观",
    en: "Default, inset, Material, and square variants",
  },
  defaultLabel: { zh: "默认", en: "Default" },
  insetLabel: { zh: "内嵌", en: "Inset" },
  squareLabel: { zh: "方形", en: "Square" },
  labelSection: { zh: "标签插槽", en: "Label slot" },
  labelTitle: { zh: "默认插槽标签", en: "Default-slot label" },
  slotLabel: { zh: "默认插槽标签", en: "Default slot label" },
  propLabel: { zh: "属性标签", en: "Property label" },
  actionSection: { zh: "动作图标", en: "Action icons" },
  actionTitle: { zh: "滑块状态图标", en: "Thumb state icons" },
  synced: { zh: "已同步", en: "Synced" },
  unsynced: { zh: "未同步", en: "Not synced" },
});

const variantCode = `<elf-switch variant="default" label="${t("defaultLabel")}" />
<elf-switch variant="inset" color="success" label="${t("insetLabel")}" />
<elf-switch variant="material" color="warning" label="Material" />
<elf-switch variant="square" color="#7c3aed" label="${t("squareLabel")}" />`;

const labelCode = `<elf-switch label-position="start">${t("slotLabel")}</elf-switch>`;

const actionCode = `<elf-switch
  active-action-icon="✓"
  inactive-action-icon="○"
  active-text="${t("synced")}"
  inactive-text="${t("unsynced")}"
/>`;

const PageSwitchEx3 = defineHtml(`
  <h2>${t("appearance")}</h2>
  <elf-playground :title=${t("appearanceTitle")} :code=${variantCode}>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:22px 40px;width:min(100%,560px)">
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="default"></elf-switch><span>${t("defaultLabel")}</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="inset" color="success" :modelValue.prop=${true}></elf-switch><span>${t("insetLabel")}</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="material" color="warning"></elf-switch><span>Material</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="square" color="#7c3aed" :modelValue.prop=${true}></elf-switch><span>${t("squareLabel")}</span></div>
    </div>
  </elf-playground>

  <h2>${t("labelSection")}</h2>
  <elf-playground :title=${t("labelTitle")} :code=${labelCode}>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <elf-switch label-position="start">${t("slotLabel")}</elf-switch>
      <elf-switch :label=${t("propLabel")}></elf-switch>
    </div>
  </elf-playground>

  <h2>${t("actionSection")}</h2>
  <elf-playground :title=${t("actionTitle")} :code=${actionCode}>
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <elf-switch active-action-icon="✓" inactive-action-icon="○" :active-text=${t("synced")} :inactive-text=${t("unsynced")}></elf-switch>
      <elf-switch variant="square" active-action-icon="✓" inactive-action-icon="○" :modelValue.prop=${true}></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx3 };
