import { defineHtml } from "@elfui/core";
import { ElfNotification } from "../../../components/Feedback";

const showNormal = () => {
  ElfNotification({
    title: "系统通知",
    message: "这是一条常规系统消息，自动在右上角堆叠显示。"
  });
};

const showInfo = () => {
  ElfNotification.info({
    title: "信息",
    message: "有新的更新可用，请查收系统公告。"
  });
};

const showSuccess = () => {
  ElfNotification.success({
    title: "成功",
    message: "您的账号密码已成功重置，请妥善保管。"
  });
};

const showWarning = () => {
  ElfNotification.warning({
    title: "安全警告",
    message: "发现异常登录尝试，登录地点：北京。"
  });
};

const showError = () => {
  ElfNotification.error({
    title: "同步失败",
    message: "无法连接到云数据库，系统将在一分钟后重试。"
  });
};

const code1 = `ElfNotification({ title: "系统通知", message: "..." })
ElfNotification.info({ title: "信息", message: "..." })
ElfNotification.success({ title: "成功", message: "..." })
ElfNotification.warning({ title: "安全警告", message: "..." })
ElfNotification.error({ title: "同步失败", message: "..." })`;

const PageNotificationEx1 = defineHtml(`
  <h2>基础用法</h2>
  <elf-playground title="基本和四种状态类型" :code="code1">
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click="showNormal">普通通知</elf-button>
      <elf-button type="primary" @click="showInfo">Info</elf-button>
      <elf-button color="success" @click="showSuccess">Success</elf-button>
      <elf-button color="warning" @click="showWarning">Warning</elf-button>
      <elf-button color="danger" @click="showError">Error</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx1 };
