import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";

const PageMessageEx1 = defineHtml(`
  <h2>基础类型</h2>
  <elf-playground title="四种语义提示">
    <elf-button @click=${() => ElfMessage.info("这是一条普通提示")}>info</elf-button>
    <elf-button color="success" @click=${() => ElfMessage.success("操作已成功完成")}>success</elf-button>
    <elf-button color="warning" @click=${() => ElfMessage.warning("请检查当前配置")}>warning</elf-button>
    <elf-button color="danger" @click=${() => ElfMessage.danger("操作失败，请稍后重试")}>danger</elf-button>
  </elf-playground>
`);

export { PageMessageEx1 };
