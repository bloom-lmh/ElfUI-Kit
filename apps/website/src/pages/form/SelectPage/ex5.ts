import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { SelectOption } from "@elfui/kit-src/components/Form";
import { createDocsTranslator } from "../../docsLocale";

const assignee = useRef("");
const remoteOptions = useRef<SelectOption[]>([]);
const remoteLoading = useRef(false);
const remoteError = useRef("");
const keyword = useRef("");
let requestVersion = 0;

const t = createDocsTranslator({
  title: { zh: "远程状态", en: "Remote states" },
  heading: { zh: "分配负责人", en: "Assign owner" },
  description: {
    zh: "忽略过期响应，避免快速输入导致结果回退。",
    en: "Stale responses are ignored so rapid input cannot roll results back.",
  },
  placeholder: { zh: "搜索姓名或团队", en: "Search by name or team" },
  directory: { zh: "远程成员目录", en: "Remote member directory" },
  searching: { zh: "正在查询成员…", en: "Searching members…" },
  noMatch: { zh: "没有匹配成员，请尝试姓名或团队", en: "No matching members. Try a name or team." },
  start: { zh: "输入关键字开始查询", en: "Type a keyword to search" },
  failure: {
    zh: "服务暂时不可用，请修改关键字后重试",
    en: "The service is unavailable. Change the keyword and retry.",
  },
  waiting: { zh: "等待查询", en: "Waiting" },
  failed: { zh: "查询失败", en: "Search failed" },
  loading: { zh: "查询中", en: "Searching" },
  results: { zh: "条结果", en: "results" },
  keyboard: { zh: "方向键选择，Enter 确认", en: "Use arrow keys and Enter to select" },
  errorHint: { zh: "输入 error 模拟失败", en: "Type error to simulate a failure" },
  owner: { zh: "当前负责人", en: "Current owner" },
  none: { zh: "尚未选择", en: "Not selected" },
  lin: { zh: "林舒 · 设计系统", en: "Lin Shu · Design system" },
  zhou: { zh: "周然 · Web 平台", en: "Zhou Ran · Web platform" },
  xu: { zh: "许宁 · 质量工程", en: "Xu Ning · Quality engineering" },
  chen: { zh: "陈墨 · 开发体验", en: "Chen Mo · Developer experience" },
  song: { zh: "宋遥 · 国际化", en: "Song Yao · Internationalization" },
  he: { zh: "何川 · 数据平台", en: "He Chuan · Data platform" },
});

const directory = (): SelectOption[] => [
  { value: "lin", label: t("lin") },
  { value: "zhou", label: t("zhou") },
  { value: "xu", label: t("xu") },
  { value: "chen", label: t("chen") },
  { value: "song", label: t("song") },
  { value: "he", label: t("he") },
];

const emptyMessage = (): string =>
  remoteError.value ? remoteError.value : keyword.value ? t("noMatch") : t("start");

const remoteStatus = (): string => {
  if (remoteLoading.value) return t("loading");
  if (remoteError.value) return t("failed");
  return remoteOptions.value.length
    ? `${remoteOptions.value.length} ${t("results")}`
    : t("waiting");
};

const remoteMethod = async (query: string): Promise<void> => {
  const currentVersion = ++requestVersion;
  const normalizedQuery = query.trim().toLowerCase();
  keyword.set(query.trim());
  remoteError.set("");
  remoteLoading.set(Boolean(normalizedQuery));

  if (!normalizedQuery) {
    remoteOptions.set([]);
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 420));
  if (currentVersion !== requestVersion) return;

  if (normalizedQuery === "error") {
    remoteOptions.set([]);
    remoteError.set(t("failure"));
    remoteLoading.set(false);
    return;
  }

  remoteOptions.set(
    directory().filter((item) =>
      `${item.label ?? ""} ${item.value}`.toLowerCase().includes(normalizedQuery),
    ),
  );
  remoteLoading.set(false);
};

const onAssigneeUpdate = (event: CustomEvent): void => {
  assignee.set(String(event.detail || ""));
};

const code = `<elf-select
  v-model="assignee"
  :options.prop="remoteOptions"
  :loading="remoteLoading"
  :remoteMethod.prop="remoteMethod"
  filterable
  remote
  clearable
  fit-input-width
>
  <div slot="header">Remote member directory</div>
  <div slot="loading">Searching members…</div>
  <div slot="empty">{{ emptyMessage() }}</div>
  <div slot="footer">Type error to simulate a failure</div>
</elf-select>`;

const script = `const assignee = useRef("");
const remoteOptions = useRef([]);
const remoteLoading = useRef(false);
let requestVersion = 0;

const remoteMethod = async (query) => {
  const currentVersion = ++requestVersion;
  remoteLoading.set(Boolean(query));
  const response = await searchMembers(query);
  if (currentVersion !== requestVersion) return;
  remoteOptions.set(response.items);
  remoteLoading.set(false);
};`;

defineStyle(`
  .select-remote-shell {
    width: min(560px, 100%);
    padding: 24px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-sm);
    background: color-mix(in srgb, var(--elf-bg-paper) 94%, var(--elf-primary) 6%);
  }
  .select-remote-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; margin-bottom:18px; }
  .select-remote-heading strong { display:block; font-size:16px; }
  .select-remote-heading p { margin:5px 0 0; color:var(--elf-text-secondary); font-size:13px; }
  .select-remote-badge { flex:none; padding:4px 8px; border-radius:999px; color:var(--elf-primary); background:color-mix(in srgb, var(--elf-primary) 12%, transparent); font-size:12px; }
  .select-remote-field { width:100%; }
  .select-remote-selection { min-height:22px; margin:14px 0 0; color:var(--elf-text-secondary); font-size:13px; }
  .select-remote-selection b { color:var(--elf-text-primary); }
  .select-remote-slot { box-sizing:border-box; min-width:0; }
  .select-remote-slot strong { color:var(--elf-text-primary); }
  .select-remote-slot small { color:var(--elf-text-secondary); }
  .select-remote-error { color:var(--elf-danger); }
`);

const PageSelectEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${remoteStatus()}</span>
    <section class="select-remote-shell">
      <header class="select-remote-heading">
        <div>
          <strong>${t("heading")}</strong>
          <p>${t("description")}</p>
        </div>
        <span class="select-remote-badge">Remote</span>
      </header>
      <elf-select
        class="select-remote-field"
        :modelValue=${assignee.value}
        :options.prop=${remoteOptions.value}
        :loading=${remoteLoading.value}
        :remoteMethod.prop=${remoteMethod}
        filterable remote clearable fit-input-width
        :placeholder=${t("placeholder")}
        @update:modelValue=${onAssigneeUpdate}
      >
        <div slot="header" class="select-remote-slot">
          <strong>${t("directory")}</strong><small>${remoteStatus()}</small>
        </div>
        <div slot="loading" class="select-remote-slot">${t("searching")}</div>
        <div slot="empty" class="select-remote-slot" :class=${{ "select-remote-error": Boolean(remoteError.value) }}>
          ${emptyMessage()}
        </div>
        <div slot="footer" class="select-remote-slot">
          <span>${t("keyboard")}</span><small>${t("errorHint")}</small>
        </div>
      </elf-select>
      <p class="select-remote-selection">
        ${t("owner")} · <b>${assignee.value || t("none")}</b>
      </p>
    </section>
  </elf-playground>
`);

export { PageSelectEx5 };
