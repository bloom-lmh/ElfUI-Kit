import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "虚拟化与键盘操作", en: "Virtualization and keyboard controls" },
  playground: { zh: "1,200 名成员分配", en: "Assign 1,200 members" },
  member: { zh: "成员", en: "Member" },
  designGroup: { zh: "跨区域设计系统与前端基础设施协作组", en: "Cross-region design system and frontend infrastructure group" },
  productGroup: { zh: "产品研发交付组", en: "Product delivery group" },
  selected: { zh: "已选", en: "Selected" },
  restored: { zh: "已恢复默认选择", en: "Default selection restored" },
  source: { zh: "候选成员", en: "Candidates" },
  target: { zh: "发布成员", en: "Release members" },
  search: { zh: "搜索成员", en: "Search members" },
  empty: { zh: "没有匹配成员", en: "No matching members" },
  reset: { zh: "恢复", en: "Reset" },
  keyboard: { zh: "空格勾选，左右方向键移动", en: "Space selects; Left and Right move items" }
});

const data = Array.from({ length: 1200 }, (_, index) => ({
  key: `member-${index + 1}`,
  label: `${t("member")} ${String(index + 1).padStart(4, "0")} · ${index % 3 === 0 ? t("designGroup") : t("productGroup")}`,
  disabled: (index + 1) % 97 === 0
}));

const selected = useRef<string[]>(["member-7", "member-18", "member-29"]);
const activity = useRef(`${t("selected")} 3 / 1,200`);

const onTransfer = (event: CustomEvent<string[]>): void => {
  const next = Array.isArray(event.detail) ? event.detail : [];
  selected.set(next);
  activity.set(`${t("selected")} ${next.length} / 1,200`);
};

const reset = (): void => {
  selected.set(["member-7", "member-18", "member-29"]);
  activity.set(t("restored"));
};

const code = `<elf-transfer
  :data.prop="data"
  :modelValue.prop="selected"
  :height="260"
  :itemSize="38"
  :overscan="4"
  filterable
  virtual
  empty-text="${t("empty")}"
  @update:modelValue="onTransfer"
/>`;

const script = `const data = Array.from({ length: 1200 }, (_, index) => ({
  key: \`member-\${index + 1}\`,
  label: \`${t("member")} \${String(index + 1).padStart(4, "0")} · ${t("productGroup")}\`,
  disabled: (index + 1) % 97 === 0
}));

const selected = useRef(["member-7", "member-18", "member-29"]);
const onTransfer = (event) => selected.set(event.detail);`;

const PageTransferEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <div slot="status" style="display:inline-flex;align-items:center;gap:8px">
      <span class="demo-state">{{ activity }} · ${t("keyboard")}</span>
      <elf-button size="small" variant="text" @click=${reset}>${t("reset")}</elf-button>
    </div>
    <div style="width:100%;max-width:980px">
      <elf-transfer
        :data.prop=${data}
        :modelValue.prop=${selected}
        :titles.prop=${[t("source"), t("target")]}
        :height=${260}
        :itemSize=${38}
        :overscan=${4}
        :filter-placeholder=${t("search")}
        :empty-text=${t("empty")}
        filterable
        virtual
        @update:modelValue=${onTransfer}
      ></elf-transfer>
    </div>
  </elf-playground>
`);

export { PageTransferEx4 };
