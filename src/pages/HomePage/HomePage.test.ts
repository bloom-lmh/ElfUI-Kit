import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import type { LocaleMessages } from "../../components/Providers/context";
import { PageHome } from "./index";

const MESSAGES: LocaleMessages = {
  home: {
    eyebrow: "English eyebrow",
    titleLead: "English title",
    titleAccent: "English accent",
    description: "English description",
    primaryAction: "Explore components",
    secondaryAction: "View Providers",
    proofLabel: "Project metrics",
    proofComponents: "components",
    proofTests: "tests",
    proofRuntime: "dependencies",
    visualLabel: "Dashboard preview",
    live: "Live",
    visualEyebrow: "Workspace",
    visualTitle: "Overview",
    metricRevenue: "Revenue",
    metricUsers: "Users",
    metricActivity: "Activity",
    metricWeek: "Week",
    visualReady: "Ready",
    principlesEyebrow: "Principles",
    principlesTitle: "Three principles",
    principlesDescription: "Principles description",
    principleOneTitle: "Native",
    principleOneDescription: "Native description",
    principleTwoTitle: "Centralized",
    principleTwoDescription: "Centralized description",
    principleThreeTitle: "Verified",
    principleThreeDescription: "Verified description",
    starterEyebrow: "Start",
    starterTitle: "Choose a path",
    starterDescription: "Starter description",
    starterForm: "Form flow",
    starterData: "Data workspace",
    starterLayout: "Responsive layout",
    codeTitle: "Provider setup",
    codeComment: "Configure once",
  },
};

const ZH_MESSAGES: LocaleMessages = {
  home: {
    eyebrow: "原生 Web 组件库",
    titleLead: "构建一致的",
    titleAccent: "产品体验",
    description: "从主题、组件到应用布局，共享一套稳定契约。",
    primaryAction: "浏览组件",
    secondaryAction: "查看主题",
    proofLabel: "项目指标",
    proofComponents: "组件与模式",
    proofTests: "自动化测试",
    proofRuntime: "运行时依赖",
    visualLabel: "仪表盘预览",
    live: "实时",
    visualEyebrow: "工作区",
    visualTitle: "总览",
    metricRevenue: "本月收入",
    metricUsers: "活跃用户",
    metricActivity: "项目活跃度",
    metricWeek: "最近 7 天",
    visualReady: "系统运行正常",
    principlesEyebrow: "原则",
    principlesTitle: "三个原则",
    principlesDescription: "原则说明",
    principleOneTitle: "原生",
    principleOneDescription: "原生说明",
    principleTwoTitle: "集中",
    principleTwoDescription: "集中说明",
    principleThreeTitle: "已验证",
    principleThreeDescription: "验证说明",
    starterEyebrow: "开始",
    starterTitle: "选择路径",
    starterDescription: "开始说明",
    starterForm: "表单流程",
    starterData: "数据工作区",
    starterLayout: "响应式布局",
    codeTitle: "Provider 配置",
    codeComment: "一次配置",
  },
};

beforeAll(async () => {
  await import("../../components");
  registerComponents(PageHome);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const homeTag = (): string =>
  String(
    (PageHome as typeof PageHome & { __elfDefinition?: { tag?: string } }).__elfDefinition?.tag,
  );

const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};

const mount = async (name: string, messages: LocaleMessages): Promise<HTMLElement> => {
  const provider = document.createElement("elf-locale-provider") as HTMLElement & {
    name?: string;
    messages?: LocaleMessages;
  };
  provider.name = name;
  provider.messages = messages;
  provider.innerHTML = `<${homeTag()}></${homeTag()}>`;
  document.body.appendChild(provider);
  await tick();
  await tick();
  return provider.querySelector(homeTag()) as HTMLElement;
};

describe("HomePage localization", () => {
  it("renders complete Chinese home content from LocaleProvider messages", async () => {
    const page = await mount("zh-CN", ZH_MESSAGES);
    const text = collectText(page);
    expect(text).toContain("构建一致的");
    expect(text).toContain("浏览组件");
    expect(text).toContain("系统运行正常");
    expect(text).toContain("¥ 86,420");
    expect(text).not.toContain("home.titleLead");
  });

  it("renders complete English home content from LocaleProvider messages without Han characters", async () => {
    const page = await mount("en-US", MESSAGES);
    const text = collectText(page);
    expect(text).toContain("English title");
    expect(text).toContain("Explore components");
    expect(text).toContain("Ready");
    expect(text).toContain("$86,420");
    expect(text).not.toContain("home.titleLead");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("publishes keyboard-focusable primary navigation", async () => {
    const page = await mount("en-US", MESSAGES);
    const links = page?.shadowRoot?.querySelectorAll<HTMLElement>("elf-link[to]") ?? [];
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute("to")).toBe("/overview");
    expect(links[0]?.shadowRoot?.querySelector("a")?.getAttribute("href")).toBe("/overview");
    expect(page?.shadowRoot?.querySelector(".principles, .starter")).toBeNull();
  });
});
