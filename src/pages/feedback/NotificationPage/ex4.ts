import { defineHtml } from "@elfui/core";

import { ElfNotification } from "../../../components/Feedback";

const code = `<elf-button @click=\${showRichContent}>显示安全富内容</elf-button>`;

const script = `const showRichContent = () => {
  const content = document.createElement("div");
  const description = document.createElement("span");
  const action = document.createElement("button");

  description.textContent = "构建任务已完成，可以查看产物。";
  action.textContent = "查看详情";
  action.addEventListener("click", () => console.info("打开构建详情"));
  content.append(description, action);

  ElfNotification({
    title: "可信 DOM 内容",
    message: content,
    duration: 0
  });
};`;

const showRichContent = (): void => {
  const content = document.createElement("div");
  const description = document.createElement("span");
  const action = document.createElement("button");

  content.style.display = "grid";
  content.style.gap = "8px";
  description.textContent = "构建任务已完成，可以查看产物。";
  action.type = "button";
  action.textContent = "查看详情";
  action.style.cssText =
    "justify-self:start;border:0;background:transparent;color:var(--elf-primary);padding:0;cursor:pointer;font:inherit;font-weight:600";
  action.addEventListener("click", () => console.info("打开构建详情"));
  content.append(description, action);

  ElfNotification({
    title: "可信 DOM 内容",
    message: content,
    duration: 0
  });
};

const PageNotificationEx4 = defineHtml(`
  <h2>安全富内容</h2>
  <elf-playground
    title="只接受已创建的 DOM Node，不解析 HTML 字符串"
    :code=${code}
    :script=${script}
  >
    <elf-button @click=${showRichContent}>显示安全富内容</elf-button>
  </elf-playground>
`);

export { PageNotificationEx4 };
