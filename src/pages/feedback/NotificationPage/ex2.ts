import { defineHtml } from "@elfui/core";
import { ElfNotification } from "../../../components/Feedback";

const showNormal = () => {
  ElfNotification({
    title: "系统通知",
    message: "这是一条常规系统消息，自动在右上角堆叠显示。",
    duration: 0,
    closeIcon: "关闭"
  });
};

const showTopLeft = () => {
  ElfNotification({
    title: "左上角通知",
    message: "这是一条在左上角弹出的消息通知。",
    position: "top-left",
    duration: 0
  });
};

const showBottomRight = () => {
  ElfNotification({
    title: "右下角通知",
    message: "这是一条在右下角弹出的消息通知。",
    position: "bottom-right",
    duration: 0
  });
};

const showBottomLeft = () => {
  ElfNotification({
    title: "左下角通知",
    message: "这是一条在左下角弹出的消息通知。",
    position: "bottom-left",
    duration: 0
  });
};

const closeAll = (): void => ElfNotification.closeAll();

const code2 = `ElfNotification({ title: "...", message: "...", position: "top-right" })
ElfNotification({ title: "...", message: "...", position: "top-left" })
ElfNotification({ title: "...", message: "...", position: "bottom-right" })
ElfNotification({ title: "...", message: "...", position: "bottom-left" })
ElfNotification.closeAll()`;

const script2 = `const showTopLeft = () => {
  ElfNotification({
    title: "左上角通知",
    message: "这是一条在左上角弹出的消息通知。",
    position: "top-left",
    duration: 0
  });
};`;

const PageNotificationEx2 = defineHtml(`
  <h2>不同弹出位置</h2>
  <elf-playground
    title="position: top-right | top-left | bottom-right | bottom-left"
    :code=${code2}
    :script=${script2}
  >
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click=${showNormal}>右上角（大关闭标签）</elf-button>
      <elf-button @click=${showTopLeft}>左上角</elf-button>
      <elf-button @click=${showBottomRight}>右下角</elf-button>
      <elf-button @click=${showBottomLeft}>左下角</elf-button>
      <elf-button color="danger" @click=${closeAll}>关闭全部</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx2 };
