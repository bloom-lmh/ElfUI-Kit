import { defineHtml, defineStyle, html, useComponents, useRef } from "@elfui/core";

import utilityStyles from "../../../styles/utilities.scss?inline";
import pageStyles from "./style.scss?inline";
import { CATALOG, type UtilityCategory, type UtilityKey } from "./catalog";
import { PageUtilitiesDraggable } from "./draggable-demo";

useComponents({
  "page-utilities-draggable": PageUtilitiesDraggable
});

interface UtilityEntry {
  key: UtilityKey;
  category: UtilityCategory;
}

interface UtilityLabState {
  groupIndex: number;
  selectedClass: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const entries = Object.entries(CATALOG).map(([key, category]) => ({
  key: key as UtilityKey,
  category
})) as UtilityEntry[];

const defaultState = (category: UtilityCategory): UtilityLabState => ({
  groupIndex: 0,
  selectedClass: category.groups[0]?.examples[0] ?? ""
});

const createInitialLabs = (): Record<UtilityKey, UtilityLabState> =>
  Object.fromEntries(entries.map(({ key, category }) => [key, defaultState(category)])) as Record<UtilityKey, UtilityLabState>;

const labs = useRef<Record<UtilityKey, UtilityLabState>>(createInitialLabs());

const labState = (key: UtilityKey): UtilityLabState => labs.value[key];

const activeGroup = (key: UtilityKey) => {
  const category = CATALOG[key];
  return category.groups[labState(key).groupIndex] ?? category.groups[0];
};

const replaceLab = (key: UtilityKey, next: UtilityLabState): void => {
  labs.set({ ...labs.peek(), [key]: next });
};

const groupOptions = (key: UtilityKey): SelectOption[] =>
  CATALOG[key].groups.map((group, index) => ({ label: group.title, value: String(index) }));

const classOptions = (key: UtilityKey): SelectOption[] =>
  activeGroup(key).examples.map((className) => ({ label: `.${className}`, value: className }));

const selectGroup = (key: UtilityKey, value: unknown): void => {
  const groupIndex = Math.max(0, Number(value) || 0);
  const group = CATALOG[key].groups[groupIndex];
  if (!group) return;
  replaceLab(key, { groupIndex, selectedClass: group.examples[0] ?? "" });
};

const selectClass = (key: UtilityKey, value: unknown): void => {
  const className = String(value ?? "");
  if (!activeGroup(key).examples.includes(className)) return;
  replaceLab(key, { ...labState(key), selectedClass: className });
};

const resetLab = (key: UtilityKey): void => replaceLab(key, defaultState(CATALOG[key]));

const previewClasses = (key: UtilityKey): string[] => {
  const className = labState(key).selectedClass;
  return className ? [className] : [];
};

const generatedCode = (key: UtilityKey): string => {
  const className = labState(key).selectedClass;
  return `<div${className ? ` class="${className}"` : ""}>\n  ElfUI utility preview\n</div>`;
};

defineStyle(`${utilityStyles}\n${pageStyles}`);

const PageUtilities = defineHtml(html`
  <elf-container>
    <h1>样式和动画</h1>

    <main class="utility-labs">
      <page-utilities-draggable style="order:99"></page-utilities-draggable>
      <article
        v-for="entry in entries"
        :key="entry.key"
        :id="'utility-' + entry.key"
        class="utility-lab"
      >
        <elf-playground :title="entry.category.title" :code="generatedCode(entry.key)">
          <code slot="status" class="lab-pattern">{{ activeGroup(entry.key).pattern }}</code>
          <div class="lab-workspace">
            <section class="lab-preview" :aria-label="entry.category.title + ' 预览'">
              <div :class="['preview-object', ...previewClasses(entry.key)]">
                <span class="preview-brand">ElfUI</span>
                <div class="preview-content"><b>A</b><b>B</b><b>C</b></div>
                <small>{{ labState(entry.key).selectedClass || '未选择工具类' }}</small>
              </div>
            </section>

            <aside class="lab-config">
              <strong>配置</strong>
              <label class="config-field">
                <span>分类</span>
                <elf-select
                  :options.prop="groupOptions(entry.key)"
                  :modelValue.prop="String(labState(entry.key).groupIndex)"
                  variant="outlined"
                  @update:modelValue="selectGroup(entry.key, $event.detail)"
                ></elf-select>
              </label>
              <label class="config-field">
                <span>工具类</span>
                <elf-select
                  :options.prop="classOptions(entry.key)"
                  :modelValue.prop="labState(entry.key).selectedClass"
                  variant="outlined"
                  @update:modelValue="selectClass(entry.key, $event.detail)"
                ></elf-select>
              </label>
              <p>{{ activeGroup(entry.key).values }}</p>
              <small v-if="activeGroup(entry.key).responsive">支持响应式断点前缀</small>
              <div class="config-actions">
                <elf-button size="sm" variant="outlined" @click="resetLab(entry.key)">重置</elf-button>
              </div>
            </aside>
          </div>
        </elf-playground>
      </article>
    </main>
  </elf-container>
`);

export { PageUtilities };
