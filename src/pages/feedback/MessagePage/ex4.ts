import { defineHtml, useRef } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";

const lastEvent = useRef("等待交互");

const showAction = (): void => {
  ElfMessage.success("草稿已保存，可立即查看详情", {
    action: "查看",
    closable: true,
    duration: 0,
    onAction: () => lastEvent.set("点击了操作按钮"),
    onClose: () => lastEvent.set("提示已关闭")
  });
};

const showBottom = (): void => {
  ElfMessage.info("同步任务正在后台运行", {
    position: "bottom",
    offset: 32,
    action: "撤销",
    closable: true,
    duration: 0,
    onAction: () => lastEvent.set("已撤销同步任务")
  });
};

const code4 = `ElfMessage.success("草稿已保存，可立即查看详情", { action: "查看", closable: true, duration: 0, onAction: () => {} })`;

const PageMessageEx4 = defineHtml(`
  <h2>操作与位置</h2>
  <elf-playground title="Snackbar 操作区" :code=${code4}>
    <elf-button color="success" @click=${showAction}>顶部操作提示</elf-button>
    <elf-button @click=${showBottom}>底部操作提示</elf-button>
    <span slot="status" class="demo-state">${lastEvent}</span>
  </elf-playground>
`);

export { PageMessageEx4 };
