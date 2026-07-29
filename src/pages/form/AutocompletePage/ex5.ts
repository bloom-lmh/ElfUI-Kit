import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "远程状态", en: "Remote states" },
  playground: { zh: "防抖、空结果与错误恢复", en: "Debouncing, empty results, and error recovery" },
  loading: { zh: "正在检索成员…", en: "Searching members…" },
  empty: { zh: "没有匹配成员", en: "No matching members" },
  error: { zh: "成员服务暂时不可用", en: "The member service is temporarily unavailable" },
  initial: { zh: "输入姓名或职责开始检索", en: "Enter a name or role to search" },
  waiting: { zh: "正在等待防抖检索", en: "Waiting for the debounced search" },
  failed: { zh: "请求失败 · 修改关键词即可重试", en: "Request failed · Change the query to retry" },
  selected: { zh: "已选择", en: "Selected" },
  invite: { zh: "邀请成员", en: "Invite member" },
  placeholder: { zh: "姓名或职责", en: "Name or role" },
  normal: { zh: "正常", en: "Results" },
  emptyLabel: { zh: "空态", en: "Empty" },
  errorLabel: { zh: "错误", en: "Error" },
  normalHint: { zh: "输入 Engineer", en: "Type Engineer" },
  emptyHint: { zh: "输入 unknown", en: "Type unknown" },
  errorHint: { zh: "输入 error，再修改关键词即可恢复", en: "Type error, then change the query to recover" },
  comment: { zh: "输入 error 查看错误态，输入 unknown 查看空态", en: "Type error for the error state or unknown for the empty state." },
  lin: { zh: "林舟", en: "Lin Zhou" },
  chen: { zh: "陈澈", en: "Chen Che" },
  zhou: { zh: "周遥", en: "Zhou Yao" },
  lu: { zh: "陆川", en: "Lu Chuan" }
});

const code = `<elf-autocomplete
  :modelValue="keyword"
  :fetchSuggestions.prop="fetchSuggestions"
  :debounce="350"
  loading-text="${t("loading")}"
  no-data-text="${t("empty")}"
  error-text="${t("error")}"
  @update:modelValue="onUpdate"
  @select="onSelect"
  @fetch-error="onFetchError"
/>
<!-- ${t("comment")} -->`;

const script = `const keyword = useRef("");
const status = useRef("${t("initial")}");

const members = [
  { label: "${t("lin")} · Product Designer", value: "${t("lin")}" },
  { label: "${t("chen")} · Frontend Engineer", value: "${t("chen")}" },
  { label: "${t("zhou")} · Quality Engineer", value: "${t("zhou")}" }
];

const fetchSuggestions = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (query.toLowerCase() === "error") throw new Error("service unavailable");
  const normalized = query.trim().toLowerCase();
  return members.filter((item) => item.label.toLowerCase().includes(normalized));
};

const onUpdate = (event) => {
  keyword.set(String(event.detail || ""));
  status.set(event.detail ? "${t("waiting")}" : "${t("initial")}");
};

const onFetchError = () => status.set("${t("failed")}");
const onSelect = (event) => status.set(\`${t("selected")}：\${event.detail.label}\`);`;

// state
const keyword = useRef("");
const status = useRef(t("initial"));

const members = [
  { label: `${t("lin")} · Product Designer`, value: t("lin") },
  { label: `${t("chen")} · Frontend Engineer`, value: t("chen") },
  { label: `${t("zhou")} · Quality Engineer`, value: t("zhou") },
  { label: `${t("lu")} · Platform Engineer`, value: t("lu") }
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
  status.set(event.detail ? t("waiting") : t("initial"));
};

const onSelect = (event: CustomEvent<(typeof members)[number]>): void => {
  status.set(`${t("selected")}：${event.detail.label}`);
};

const onFetchError = (): void => {
  status.set(t("failed"));
};

const PageAutocompleteEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:grid;grid-template-columns:minmax(240px,360px) minmax(0,1fr);gap:24px;align-items:center;width:min(100%,760px)">
      <elf-autocomplete
        :modelValue=${keyword}
        :fetchSuggestions.prop=${fetchSuggestions}
        :debounce=${350}
        :label=${t("invite")}
        :placeholder=${t("placeholder")}
        :loading-text=${t("loading")}
        :no-data-text=${t("empty")}
        :error-text=${t("error")}
        highlight-first-item
        fit-input-width
        clearable
        @update:modelValue=${onUpdate}
        @select=${onSelect}
        @fetch-error=${onFetchError}
      ></elf-autocomplete>
      <div style="display:grid;gap:7px;color:var(--elf-text-secondary);font-size:13px;line-height:1.5">
        <span><strong style="color:var(--elf-text-primary)">${t("normal")}：</strong>${t("normalHint")}</span>
        <span><strong style="color:var(--elf-text-primary)">${t("emptyLabel")}：</strong>${t("emptyHint")}</span>
        <span><strong style="color:var(--elf-text-primary)">${t("errorLabel")}：</strong>${t("errorHint")}</span>
      </div>
    </div>
  </elf-playground>
`);

export { PageAutocompleteEx5 };
