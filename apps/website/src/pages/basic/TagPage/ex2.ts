import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface FilterOption {
  id: string;
  label: string;
  color: string;
}

interface EditableTag {
  id: string;
  label: string;
  color: string;
  editing: boolean;
}

const FILTER_OPTIONS: readonly FilterOption[] = [
  { id: "design", label: "Design", color: "primary" },
  { id: "frontend", label: "Frontend", color: "success" },
  { id: "quality", label: "Quality", color: "info" },
];

const t = createDocsTranslator({
  selectionTitle: { zh: "选择状态与内容溢出", en: "Selection state and content overflow" },
  selectionReady: { zh: "已选", en: "Selected" },
  none: { zh: "无", en: "None" },
  filters: { zh: "可选择筛选项", en: "Selectable filters" },
  filterHint: {
    zh: "Tab 聚焦后使用 Enter 或 Space 切换，aria-pressed 与状态同步。",
    en: "After Tab focuses a tag, use Enter or Space; aria-pressed follows the state.",
  },
  overflow: { zh: "超长内容", en: "Long content" },
  overflowHint: {
    zh: "标签在受限宽度内省略，完整文本仍保留在插槽和 title 中。",
    en: "The tag truncates inside a constrained width while the full slot text and title remain available.",
  },
  longStatus: {
    zh: "需要安全团队人工复核的高优先级发布状态",
    en: "High-priority release status requiring manual security review",
  },
  dynamicTitle: { zh: "动态列表与行内编辑", en: "Dynamic list and inline editing" },
  count: { zh: "标签数", en: "Tags" },
  ready: { zh: "可新增、编辑或关闭", en: "Ready to add, edit, or close" },
  added: { zh: "已新增", en: "Added" },
  renamed: { zh: "已重命名", en: "Renamed" },
  removed: { zh: "已移除", en: "Removed" },
  inputPlaceholder: { zh: "输入新标签", en: "New tag name" },
  add: { zh: "新增标签", en: "Add tag" },
  edit: { zh: "编辑", en: "Edit" },
  editLabel: { zh: "编辑标签", en: "Edit tag" },
  editPlaceholder: { zh: "标签名称", en: "Tag name" },
  keyboardHint: {
    zh: "编辑框：Enter 保存，Esc 取消；关闭按钮支持 Tab + Enter / Space。",
    en: "Editor: Enter saves and Escape cancels; close buttons support Tab + Enter / Space.",
  },
});

const host = useHost();

// State
const selected = useRef<Record<string, boolean>>({ design: true, frontend: false, quality: true });
const tagItems = useRef<EditableTag[]>([
  { id: "tag-1", label: "Design system", color: "primary", editing: false },
  { id: "tag-2", label: "Web Components", color: "success", editing: false },
  { id: "tag-3", label: "Accessibility", color: "info", editing: false },
]);
const newTag = useRef("");
const editingId = useRef("");
const editValue = useRef("");
const activity = useRef("ready");
let nextTagId = 4;

// Derived state
const isSelected = (id: string): boolean => Boolean(selected.value[id]);
const selectedLabels = (): string => {
  const labels = FILTER_OPTIONS.filter((option) => isSelected(option.id)).map(
    (option) => option.label,
  );
  return labels.length > 0 ? labels.join(" · ") : t("none");
};
const editableTags = (): EditableTag[] =>
  tagItems.value.map((tag) => ({ ...tag, editing: tag.id === editingId.value }));
const activityText = (): string =>
  `${t("count")} ${tagItems.value.length} · ${t(activity.value as "ready" | "added" | "renamed" | "removed")}`;
const editAriaLabel = (label: string): string => `${t("editLabel")}：${label}`;

// Methods
const onFilterChange = (event: CustomEvent<boolean>): void => {
  const id = (event.currentTarget as HTMLElement).dataset.id || "";
  if (!id) return;
  selected.set({ ...selected.value, [id]: Boolean(event.detail) });
};

const onNewTagInput = (event: Event): void => newTag.set((event.target as HTMLInputElement).value);

const addTag = (event: SubmitEvent): void => {
  event.preventDefault();
  const label = newTag.value.trim();
  if (!label) return;
  tagItems.set([
    ...tagItems.value,
    { id: `tag-${nextTagId++}`, label, color: "secondary", editing: false },
  ]);
  newTag.set("");
  activity.set("added");
};

const startEdit = (event: Event): void => {
  const id = (event.currentTarget as HTMLElement).dataset.id || "";
  const item = tagItems.value.find((tag) => tag.id === id);
  if (!item) return;
  editingId.set(id);
  editValue.set(item.label);
  queueMicrotask(() => {
    const input = host.shadowRoot?.querySelector<HTMLInputElement>(`[data-edit-id="${id}"]`);
    input?.focus();
    input?.select();
  });
};

const onEditInput = (event: Event): void => editValue.set((event.target as HTMLInputElement).value);

const cancelEdit = (): void => {
  editingId.set("");
  editValue.set("");
};

const commitEdit = (event: Event): void => {
  const id = (event.currentTarget as HTMLElement).dataset.editId || "";
  if (!id || editingId.value !== id) return;
  const label = editValue.value.trim();
  if (label) {
    tagItems.set(tagItems.value.map((tag) => (tag.id === id ? { ...tag, label } : tag)));
    activity.set("renamed");
  }
  cancelEdit();
};

const onEditKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    event.preventDefault();
    commitEdit(event);
  } else if (event.key === "Escape") {
    event.preventDefault();
    cancelEdit();
  }
};

const removeTag = (event: Event): void => {
  const id = (event.currentTarget as HTMLElement).dataset.id || "";
  if (!id) return;
  tagItems.set(tagItems.value.filter((tag) => tag.id !== id));
  if (editingId.value === id) cancelEdit();
  activity.set("removed");
};

const selectionCode = `<elf-tag
  v-for="option in options"
  :key="option.id"
  :checked.prop="selected[option.id]"
  @update:checked=\${onFilterChange}
>
  {{ option.label }}
</elf-tag>

<elf-tag class="constrained-tag" title="Full status text">
  A very long status that is visually truncated
</elf-tag>`;

const selectionScript = `const selected = useRef({ design: true, frontend: false });

const onFilterChange = (event) => {
  const id = event.currentTarget.dataset.id;
  selected.set({ ...selected.value, [id]: event.detail });
};

// 只需限制 elf-tag 宿主宽度；内部 label part 会自动省略。
// 完整插槽文本不会被删除，可配合 title 或 Tooltip 展示。`;

const dynamicCode = `<form @submit=\${addTag}>
  <input :value.prop=\${newTag} @input=\${onInput} />
  <elf-button type="submit">Add tag</elf-button>
</form>

<elf-tag
  v-for="tag in tags"
  :key="tag.id"
  closable
  @close=\${removeTag}
>
  {{ tag.label }}
</elf-tag>`;

const dynamicScript = `const tags = useRef([
  { id: "tag-1", label: "Design system" },
  { id: "tag-2", label: "Web Components" }
]);
const newTag = useRef("");

const addTag = (event) => {
  event.preventDefault();
  const label = newTag.value.trim();
  if (!label) return;
  tags.set([...tags.value, { id: crypto.randomUUID(), label }]);
  newTag.set("");
};

const removeTag = (event) => {
  const id = event.currentTarget.dataset.id;
  tags.set(tags.value.filter((tag) => tag.id !== id));
};

// 编辑状态属于列表，不进入 Tag 公共 API；Enter 保存，Escape 取消。`;

defineStyle(styles);

const PageTagEx2 = defineHtml(`
  <elf-playground :title=${t("selectionTitle")} :code=${selectionCode} :script=${selectionScript}>
    <span slot="status" class="tag-demo-status" role="status" aria-live="polite">
      ${t("selectionReady")}：${selectedLabels()}
    </span>
    <div class="tag-boundary-grid">
      <article class="tag-demo-card">
        <strong>${t("filters")}</strong>
        <p>${t("filterHint")}</p>
        <div class="tag-demo-row">
          <elf-tag
            v-for="option in FILTER_OPTIONS"
            :key="option.id"
            :data-id="option.id"
            :type="option.color"
            :checked.prop="isSelected(option.id)"
            @update:checked=${onFilterChange}
          >
            {{ option.label }}
          </elf-tag>
        </div>
      </article>
      <article class="tag-demo-card">
        <strong>${t("overflow")}</strong>
        <p>${t("overflowHint")}</p>
        <elf-tag class="tag-overflow-example" type="warning" :title=${t("longStatus")}>
          ${t("longStatus")}
        </elf-tag>
      </article>
    </div>
  </elf-playground>

  <elf-playground :title=${t("dynamicTitle")} :code=${dynamicCode} :script=${dynamicScript}>
    <span slot="status" class="tag-demo-actions" role="status" aria-live="polite">
      ${activityText()}
    </span>
    <section class="tag-editor-panel">
      <form class="tag-add-form" @submit=${addTag}>
        <label>
          <span>${t("inputPlaceholder")}</span>
          <input
            :value.prop=${newTag}
            :placeholder=${t("inputPlaceholder")}
            @input=${onNewTagInput}
          />
        </label>
        <elf-button type="submit">${t("add")}</elf-button>
      </form>
      <div class="tag-editor-list">
        <span v-for="tag in editableTags()" :key="tag.id" class="tag-editor-item">
          <template v-if="tag.editing">
            <input
              class="tag-edit-input"
              :data-edit-id="tag.id"
              :value.prop=${editValue}
              :placeholder=${t("editPlaceholder")}
              @input=${onEditInput}
              @keydown=${onEditKeydown}
              @blur=${commitEdit}
            />
          </template>
          <template v-else>
            <elf-tag
              :data-id="tag.id"
              :type="tag.color"
              closable
              @close=${removeTag}
            >
              {{ tag.label }}
            </elf-tag>
            <button
              class="tag-edit-trigger"
              type="button"
              :data-id="tag.id"
              :aria-label="editAriaLabel(tag.label)"
              @click=${startEdit}
            >
              ${t("edit")}
            </button>
          </template>
        </span>
      </div>
      <p class="tag-editor-hint">${t("keyboardHint")}</p>
    </section>
  </elf-playground>
`);

export { PageTagEx2 };
