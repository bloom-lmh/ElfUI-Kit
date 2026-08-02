import { defineHtml } from "@elfui/core";

import { ElfNotification } from "@elfui/kit-src/components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "安全富内容", en: "Safe rich content" },
  show: { zh: "显示安全富内容", en: "Show safe rich content" },
  description: {
    zh: "构建任务已完成，可以查看产物。",
    en: "The build completed. Its artifacts are ready to review.",
  },
  details: { zh: "查看详情", en: "View details" },
  openLog: { zh: "打开构建详情", en: "Open build details" },
  title: { zh: "可信 DOM 内容", en: "Trusted DOM content" },
});

const code = `<elf-button @click=\${showRichContent}>${t("show")}</elf-button>`;

const script = `const showRichContent = () => {
  const content = document.createElement("div");
  const description = document.createElement("span");
  const action = document.createElement("button");

  description.textContent = "${t("description")}";
  action.textContent = "${t("details")}";
  action.addEventListener("click", () => console.info("${t("openLog")}"));
  content.append(description, action);

  ElfNotification({
    title: "${t("title")}",
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
  description.textContent = t("description");
  action.type = "button";
  action.textContent = t("details");
  action.style.cssText =
    "justify-self:start;border:0;background:transparent;color:var(--elf-primary);padding:0;cursor:pointer;font:inherit;font-weight:600";
  action.addEventListener("click", () => console.info(t("openLog")));
  content.append(description, action);

  ElfNotification({
    title: t("title"),
    message: content,
    duration: 0,
  });
};

const PageNotificationEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground
    :title=${t("section")}
    :code=${code}
    :script=${script}
  >
    <elf-button @click=${showRichContent}>${t("show")}</elf-button>
  </elf-playground>
`);

export { PageNotificationEx4 };
