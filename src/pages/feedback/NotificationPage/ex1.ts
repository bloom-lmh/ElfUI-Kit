import { defineHtml } from "@elfui/core";
import { ElfNotification } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  systemTitle: { zh: "系统通知", en: "System notification" },
  systemMessage: { zh: "这是一条常规系统消息，自动在右上角堆叠显示。", en: "This standard system message stacks automatically in the top-right corner." },
  infoTitle: { zh: "信息", en: "Information" },
  infoMessage: { zh: "有新的更新可用，请查收系统公告。", en: "A new update is available. Please review the system announcement." },
  successTitle: { zh: "成功", en: "Success" },
  successMessage: { zh: "您的账号密码已成功重置，请妥善保管。", en: "Your account password was reset successfully." },
  warningTitle: { zh: "安全警告", en: "Security warning" },
  warningMessage: { zh: "发现异常登录尝试，登录地点：北京。", en: "An unusual sign-in attempt was detected in Beijing." },
  errorTitle: { zh: "同步失败", en: "Sync failed" },
  errorMessage: { zh: "无法连接到云数据库，系统将在一分钟后重试。", en: "The cloud database is unavailable. The system will retry in one minute." },
  normalButton: { zh: "普通通知", en: "Standard notification" },
});

const showNormal = () => {
  ElfNotification({
    title: t("systemTitle"),
    message: t("systemMessage")
  });
};

const showInfo = () => {
  ElfNotification.info({
    title: t("infoTitle"),
    message: t("infoMessage")
  });
};

const showSuccess = () => {
  ElfNotification.success({
    title: t("successTitle"),
    message: t("successMessage")
  });
};

const showWarning = () => {
  ElfNotification.warning({
    title: t("warningTitle"),
    message: t("warningMessage")
  });
};

const showError = () => {
  ElfNotification.error({
    title: t("errorTitle"),
    message: t("errorMessage")
  });
};

const code = `<elf-button @click=\${showNormal}>${t("normalButton")}</elf-button>
<elf-button @click=\${showInfo}>Info</elf-button>
<elf-button color="success" @click=\${showSuccess}>Success</elf-button>
<elf-button color="warning" @click=\${showWarning}>Warning</elf-button>
<elf-button color="danger" @click=\${showError}>Error</elf-button>`;

const script = `const showNormal = () => ElfNotification({
  title: "${t("systemTitle")}",
  message: "${t("systemMessage")}"
});
const showInfo = () => ElfNotification.info({ title: "${t("infoTitle")}", message: "${t("infoMessage")}" });
const showSuccess = () => ElfNotification.success({ title: "${t("successTitle")}", message: "${t("successMessage")}" });
const showWarning = () => ElfNotification.warning({ title: "${t("warningTitle")}", message: "${t("warningMessage")}" });
const showError = () => ElfNotification.error({ title: "${t("errorTitle")}", message: "${t("errorMessage")}" });`;

const PageNotificationEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click=${showNormal}>${t("normalButton")}</elf-button>
      <elf-button type="primary" @click=${showInfo}>Info</elf-button>
      <elf-button color="success" @click=${showSuccess}>Success</elf-button>
      <elf-button color="warning" @click=${showWarning}>Warning</elf-button>
      <elf-button color="danger" @click=${showError}>Error</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx1 };
