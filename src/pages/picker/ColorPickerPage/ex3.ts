import { defineHtml, useRef } from "@elfui/core";

const accent = useRef("#006a6a");
const touched = useRef(false);
const panelState = useRef("面板关闭");

const presets = ["#6750a4", "#006a6a", "#f9a825", "#d32f2f"];

const updateAccent = (event: CustomEvent<string>): void => {
  accent.set(String(event.detail || ""));
  touched.set(true);
};

const onVisibleChange = (event: CustomEvent<boolean>): void => {
  panelState.set(event.detail ? "面板打开" : "面板关闭");
};

const errorText = (): string => (touched.value && !accent.value ? "请选择品牌强调色" : "");

const code = `<elf-form label-position="top">
  <elf-form-item
    label="品牌强调色"
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
  ? "请选择品牌强调色"
  : "";`;

const PageColorPickerEx3 = defineHtml(`
  <elf-playground title="键盘、清空与表单边界" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ panelState }} · Enter/↓ 打开 · Esc 关闭</span>
    <div style="width:100%;max-width:560px">
      <elf-card style="width:100%">
        <div style="padding:20px 22px">
          <elf-form label-position="top">
            <elf-form-item label="品牌强调色" required :error=${errorText()}>
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
            面板使用 Top Layer；外部点击、外层滚动或 Esc 都会关闭。
          </p>
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageColorPickerEx3 };
