import { defineHtml, useRef } from "@elfui/core";

const code = `<elf-autocomplete
  :modelValue="keyword"
  :fetchSuggestions.prop="fetchSuggestions"
  :debounce="350"
  loading-text="正在检索成员…"
  no-data-text="没有匹配成员"
  error-text="成员服务暂时不可用"
  @update:modelValue="onUpdate"
  @select="onSelect"
  @fetch-error="onFetchError"
/>
<!-- 输入 error 查看错误态，输入 unknown 查看空态 -->`;

const script = `const keyword = useRef("");
const status = useRef("输入姓名或职责开始检索");

const members = [
  { label: "林舟 · Product Designer", value: "林舟" },
  { label: "陈澈 · Frontend Engineer", value: "陈澈" },
  { label: "周遥 · Quality Engineer", value: "周遥" }
];

const fetchSuggestions = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (query.toLowerCase() === "error") throw new Error("service unavailable");
  const normalized = query.trim().toLowerCase();
  return members.filter((item) => item.label.toLowerCase().includes(normalized));
};

const onUpdate = (event) => {
  keyword.set(String(event.detail || ""));
  status.set(event.detail ? "正在等待防抖检索" : "输入姓名或职责开始检索");
};

const onFetchError = () => status.set("请求失败 · 修改关键词即可重试");
const onSelect = (event) => status.set(\`已选择：\${event.detail.label}\`);`;

// state
const keyword = useRef("");
const status = useRef("输入姓名或职责开始检索");

const members = [
  { label: "林舟 · Product Designer", value: "林舟" },
  { label: "陈澈 · Frontend Engineer", value: "陈澈" },
  { label: "周遥 · Quality Engineer", value: "周遥" },
  { label: "陆川 · Platform Engineer", value: "陆川" }
];

// actions
const fetchSuggestions = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (query.toLowerCase() === "error") throw new Error("service unavailable");
  const normalized = query.trim().toLowerCase();
  return members.filter((item) => item.label.toLowerCase().includes(normalized));
};

const onUpdate = (event: CustomEvent<string>): void => {
  keyword.set(String(event.detail || ""));
  status.set(event.detail ? "正在等待防抖检索" : "输入姓名或职责开始检索");
};

const onSelect = (event: CustomEvent<(typeof members)[number]>): void => {
  status.set(`已选择：${event.detail.label}`);
};

const onFetchError = (): void => {
  status.set("请求失败 · 修改关键词即可重试");
};

const PageAutocompleteEx5 = defineHtml(`
  <h2>远程状态</h2>
  <elf-playground title="防抖、空结果与错误恢复" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:grid;grid-template-columns:minmax(240px,360px) minmax(0,1fr);gap:24px;align-items:center;width:min(100%,760px)">
      <elf-autocomplete
        :modelValue=${keyword}
        :fetchSuggestions.prop=${fetchSuggestions}
        :debounce=${350}
        label="邀请成员"
        placeholder="姓名或职责"
        loading-text="正在检索成员…"
        no-data-text="没有匹配成员"
        error-text="成员服务暂时不可用"
        highlight-first-item
        fit-input-width
        clearable
        @update:modelValue=${onUpdate}
        @select=${onSelect}
        @fetch-error=${onFetchError}
      ></elf-autocomplete>
      <div style="display:grid;gap:7px;color:var(--elf-text-secondary);font-size:13px;line-height:1.5">
        <span><strong style="color:var(--elf-text-primary)">正常：</strong>输入 Engineer</span>
        <span><strong style="color:var(--elf-text-primary)">空态：</strong>输入 unknown</span>
        <span><strong style="color:var(--elf-text-primary)">错误：</strong>输入 error，再修改关键词即可恢复</span>
      </div>
    </div>
  </elf-playground>
`);

export { PageAutocompleteEx5 };
