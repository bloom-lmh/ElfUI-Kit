import { defineHtml, useRef, useTemplateRef } from "@elfui/core";

const amount = useRef("1200");
const nickname = useRef("ElfUI");
const phone = useRef("");
const commandInput = useTemplateRef<HTMLElement>("commandInput");

const currencyFormatter = (value: string): string =>
  value ? `$ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "";

const currencyParser = (value: string): string => value.replace(/[^\d.]/g, "");

const countGraphemes = (value: string): number => Array.from(value).length;

const code1 = `<div style="width:320px;margin-bottom:8px">
  <elf-input
    :modelValue.prop=\${amount.value}
    :formatter.prop=\${currencyFormatter}
    :parser.prop=\${currencyParser}
    clearable
    placeholder="请输入金额"
    @update:modelValue=\${onAmountUpdate}
  >
    <span slot="prepend">总价</span>
    <span slot="append">USD</span>
  </elf-input>
</div>
<span slot="status" class="demo-state">原始值：{{ amount }}</span>`;

const script1 = `const amount = useRef("1200");

const currencyFormatter = (value) =>
  value ? \`$ \${value.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}\` : "";

const currencyParser = (value) => value.replace(/[^\\d.]/g, "");

const onAmountUpdate = (event) => {
  amount.set(String(event.detail || ""));
};`;

const code2 = `<div style="width:320px;margin-bottom:8px">
  <elf-input
    :modelValue.prop=\${nickname.value}
    :countGraphemes.prop=\${countGraphemes}
    maxlength="12"
    show-word-limit
    word-limit-position="outside"
    placeholder="昵称最多 12 个字符"
    @update:modelValue=\${onNicknameUpdate}
  >
    <span slot="prefix">@</span>
    <span slot="suffix">CN</span>
  </elf-input>
</div>
<span slot="status" class="demo-state">昵称：{{ nickname }}</span>`;

const script2 = `const nickname = useRef("ElfUI");

const countGraphemes = (value) => Array.from(value).length;

const onNicknameUpdate = (event) => {
  nickname.set(String(event.detail || ""));
};`;

const code3 = `<div style="width:320px">
  <elf-input
    :modelValue.prop=\${phone.value}
    id="phone"
    name="phone"
    aria-label="手机号"
    inputmode="numeric"
    autocomplete="tel"
    minlength="6"
    maxlength="11"
    placeholder="手机号"
    @update:modelValue=\${onPhoneUpdate}
  />
</div>`;

const script3 = `const phone = useRef("");

const onPhoneUpdate = (event) => {
  phone.set(String(event.detail || ""));
};`;

const code4 = `<elf-input ref="commandInput" placeholder="使用标题按钮控制焦点" />
<div slot="status">
  <elf-button size="small" @click=\${focusInput}>聚焦</elf-button>
  <elf-button size="small" @click=\${blurInput}>失焦</elf-button>
</div>`;

const script4 = `const commandInput = useTemplateRef("commandInput");

const focusInput = () => commandInput.value?.focus();
const blurInput = () => commandInput.value?.blur();`;

const onAmountUpdate = (event: CustomEvent): void => {
  amount.set(String(event.detail || ""));
};

const onNicknameUpdate = (event: CustomEvent): void => {
  nickname.set(String(event.detail || ""));
};

const onPhoneUpdate = (event: CustomEvent): void => {
  phone.set(String(event.detail || ""));
};

const focusInput = (): void => commandInput.value?.focus();

const blurInput = (): void => commandInput.value?.blur();

const PageInputEx3 = defineHtml(`
  <h2>格式化与插槽</h2>
  <elf-playground title="formatter / parser / prepend / append" :code=${code1} :script=${script1}>
    <div style="width:320px;margin-bottom:8px">
      <elf-input
        :modelValue.prop=${amount.value}
        :formatter.prop=${currencyFormatter}
        :parser.prop=${currencyParser}
        clearable
        placeholder="请输入金额"
        @update:modelValue=${onAmountUpdate}
      >
        <span slot="prepend">总价</span>
        <span slot="append">USD</span>
      </elf-input>
    </div>
    <span slot="status" class="demo-state">原始值：{{ amount }}</span>
  </elf-playground>

  <h2>字数统计</h2>
  <elf-playground title="show-word-limit / count-graphemes" :code=${code2} :script=${script2}>
    <div style="width:320px;margin-bottom:8px">
      <elf-input
        :modelValue.prop=${nickname.value}
        :countGraphemes.prop=${countGraphemes}
        maxlength="12"
        show-word-limit
        word-limit-position="outside"
        placeholder="昵称最多 12 个字符"
        @update:modelValue=${onNicknameUpdate}
      >
        <span slot="prefix">@</span>
        <span slot="suffix">CN</span>
      </elf-input>
    </div>
    <span slot="status" class="demo-state">昵称：{{ nickname }}</span>
  </elf-playground>

  <h2>原生属性</h2>
  <elf-playground title="id / name / aria-label / inputmode" :code=${code3} :script=${script3}>
    <div style="width:320px">
      <elf-input
        :modelValue.prop=${phone.value}
        id="phone"
        name="phone"
        aria-label="手机号"
        inputmode="numeric"
        autocomplete="tel"
        minlength="6"
        maxlength="11"
        placeholder="手机号"
        @update:modelValue=${onPhoneUpdate}
      ></elf-input>
    </div>
  </elf-playground>

  <h2>命令式焦点</h2>
  <elf-playground title="focus / blur" :code=${code4} :script=${script4}>
    <div style="width:min(100%, 360px)">
      <elf-input ref="commandInput" placeholder="使用标题按钮控制焦点"></elf-input>
    </div>
    <div slot="status" style="display:flex;align-items:center;gap:8px">
      <elf-button size="small" @click=${focusInput}>聚焦</elf-button>
      <elf-button size="small" @click=${blurInput}>失焦</elf-button>
    </div>
  </elf-playground>
`);

export { PageInputEx3 };
