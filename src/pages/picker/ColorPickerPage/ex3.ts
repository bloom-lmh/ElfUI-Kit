import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "键盘、清空与表单边界", en: "Keyboard, clearing, and form boundaries" },
  label: { zh: "品牌强调色", en: "Brand accent" },
  error: { zh: "请选择品牌强调色", en: "Select a brand accent color" },
  opened: { zh: "面板打开", en: "Panel open" },
  closed: { zh: "面板关闭", en: "Panel closed" },
  keyboard: { zh: "Enter/↓ 打开 · Esc 关闭", en: "Enter/↓ opens · Esc closes" },
  note: {
    zh: "面板使用 Top Layer；外部点击、外层滚动或 Esc 都会关闭。",
    en: "The panel uses the Top Layer and closes on outside click, ancestor scroll, or Escape.",
  },
});

const accent = useRef("#006a6a");
const touched = useRef(false);
const panelOpen = useRef(false);

const presets = ["#6750a4", "#006a6a", "#f9a825", "#d32f2f"];

const updateAccent = (event: CustomEvent<string>): void => {
  accent.set(String(event.detail || ""));
  touched.set(true);
};

const onVisibleChange = (event: CustomEvent<boolean>): void => {
  panelOpen.set(Boolean(event.detail));
};

const errorText = (): string => (touched.value && !accent.value ? t("error") : "");

const code = `<elf-form label-position="top">
  <elf-form-item
    label="Brand accent"
    required
    :error="errorText()"
  >
    <elf-color-picker
      :modelValue.prop="accent"
      color-format="rgb"
      :predefine.prop="presets"
      clearable
      @update:modelValue="updateAccent"
      @visible-change="onVisibleChange"
    />
  </elf-form-item>
</elf-form>`;

const script = `const accent = useRef("#006a6a");
const touched = useRef(false);

const updateAccent = (event) => {
  accent.set(event.detail);
  touched.set(true);
};

const errorText = () => touched.value && !accent.value
  ? "Select a brand accent color"
  : "";`;

const PageColorPickerEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${panelOpen ? t("opened") : t("closed")} · ${t("keyboard")}</span>
    <div style="width:100%;max-width:560px">
      <elf-card style="width:100%">
        <div style="padding:20px 22px">
          <elf-form label-position="top">
            <elf-form-item :label=${t("label")} required :error=${errorText()}>
              <elf-color-picker
                :modelValue.prop=${accent}
                color-format="rgb"
                :predefine.prop=${presets}
                clearable
                @update:modelValue=${updateAccent}
                @visible-change=${onVisibleChange}
              ></elf-color-picker>
            </elf-form-item>
          </elf-form>
          <p style="margin:12px 0 0;color:var(--elf-text-secondary);font-size:13px">
            ${t("note")}
          </p>
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageColorPickerEx3 };
