import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { SelectOption } from "../../../components/Form";

const directory: SelectOption[] = [
  { value: "lin", label: "林舟 · 设计系统" },
  { value: "zhou", label: "周然 · Web 平台" },
  { value: "xu", label: "许宁 · 质量工程" },
  { value: "chen", label: "陈墨 · 开发体验" },
  { value: "song", label: "宋遥 · 国际化" },
  { value: "he", label: "何川 · 数据平台" }
];

const assignee = useRef("");
const remoteOptions = useRef<SelectOption[]>([]);
const remoteLoading = useRef(false);
const remoteError = useRef("");
const keyword = useRef("");

let requestVersion = 0;

const emptyMessage = (): string => {
  if (remoteError.value) return remoteError.value;
  return keyword.value ? "没有匹配成员，请尝试姓名或团队" : "输入关键字开始查询";
};

const remoteStatus = (): string => {
  if (remoteLoading.value) return "查询中";
  if (remoteError.value) return "查询失败";
  return remoteOptions.value.length ? `${remoteOptions.value.length} 条结果` : "等待查询";
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
    remoteError.set("服务暂时不可用，请修改关键字后重试");
    remoteLoading.set(false);
    return;
  }

  remoteOptions.set(
    directory.filter((item) => {
      const haystack = `${item.label ?? ""} ${item.value}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    })
  );
  remoteLoading.set(false);
};

const code = `<elf-select
  v-model="assignee"
  :options.prop="remoteOptions"
  :loading="remoteLoading"
  :remote-method.prop="remoteMethod"
  filterable
  remote
  clearable
  fit-input-width
  placeholder="搜索姓名或团队"
>
  <div slot="header">远程成员目录</div>
  <div slot="loading">正在查询成员…</div>
  <div slot="empty">{{ emptyMessage() }}</div>
  <div slot="footer">输入 error 可模拟请求失败</div>
</elf-select>`;

const script = `const assignee = useRef("");
const remoteOptions = useRef([]);
const remoteLoading = useRef(false);
const remoteError = useRef("");
const keyword = useRef("");

let requestVersion = 0;

const remoteMethod = async (query) => {
  const currentVersion = ++requestVersion;
  const normalizedQuery = query.trim().toLowerCase();

  keyword.set(query.trim());
  remoteError.set("");
  remoteLoading.set(Boolean(normalizedQuery));

  if (!normalizedQuery) {
    remoteOptions.set([]);
    return;
  }

  const response = await searchMembers(normalizedQuery);
  if (currentVersion !== requestVersion) return;

  remoteOptions.set(response.items);
  remoteLoading.set(false);
};

const emptyMessage = () =>
  remoteError.value ||
  (keyword.value ? "没有匹配成员，请尝试姓名或团队" : "输入关键字开始查询");`;

defineStyle(`
  .select-remote-shell {
    width: min(560px, 100%);
    padding: 24px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-md);
    background: color-mix(in srgb, var(--elf-bg-paper) 92%, var(--elf-primary) 8%);
  }
  .select-remote-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;
  }
  .select-remote-heading strong { display: block; font-size: 16px; }
  .select-remote-heading p { margin: 5px 0 0; color: var(--elf-text-secondary); font-size: 13px; }
  .select-remote-badge {
    flex: none;
    padding: 4px 8px;
    border-radius: 999px;
    color: var(--elf-primary);
    background: color-mix(in srgb, var(--elf-primary) 12%, transparent);
    font-size: 12px;
  }
  .select-remote-field { width: 100%; }
  .select-remote-selection {
    min-height: 22px;
    margin: 14px 0 0;
    color: var(--elf-text-secondary);
    font-size: 13px;
  }
  .select-remote-selection b { color: var(--elf-text-primary); }
  .select-remote-slot { box-sizing: border-box; min-width: 0; }
  .select-remote-slot strong { color: var(--elf-text-primary); }
  .select-remote-slot small { color: var(--elf-text-secondary); }
  .select-remote-error { color: var(--elf-danger); }
  @media (max-width: 640px) {
    .select-remote-shell { padding: 18px; }
    .select-remote-heading { align-items: stretch; flex-direction: column; gap: 10px; }
    .select-remote-badge { align-self: flex-start; }
  }
`);

const PageSelectEx5 = defineHtml(`
  <h2>远程数据</h2>
  <elf-playground title="加载、空结果与错误反馈" :code=${code} :script=${script}>
    <span slot="status">{{ remoteStatus() }}</span>
    <section class="select-remote-shell">
      <header class="select-remote-heading">
        <div>
          <strong>分配负责人</strong>
          <p>请求中的旧响应会被忽略，避免快速输入造成结果回退。</p>
        </div>
        <span class="select-remote-badge">Remote</span>
      </header>

      <elf-select
        class="select-remote-field"
        v-model="assignee"
        :options.prop=${remoteOptions}
        :loading=${remoteLoading}
        :remoteMethod.prop=${remoteMethod}
        filterable
        remote
        clearable
        fit-input-width
        placeholder="搜索姓名或团队"
      >
        <div slot="header" class="select-remote-slot">
          <strong>远程成员目录</strong>
          <small>{{ remoteStatus() }}</small>
        </div>
        <div slot="loading" class="select-remote-slot">正在查询成员…</div>
        <div
          slot="empty"
          class="select-remote-slot"
          :class=${{ "select-remote-error": remoteError }}
        >
          {{ emptyMessage() }}
        </div>
        <div slot="footer" class="select-remote-slot">
          <span>按 ↑ ↓ 选择，Enter 确认</span>
          <small>输入 error 模拟失败</small>
        </div>
      </elf-select>

      <p class="select-remote-selection">
        当前负责人：<b>{{ assignee || "尚未选择" }}</b>
      </p>
    </section>
  </elf-playground>
`);

export { PageSelectEx5 };
