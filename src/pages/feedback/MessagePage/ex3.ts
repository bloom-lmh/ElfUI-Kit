import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";

const showStack = (): void => {
  ElfMessage.info("第 1 条：任务已加入队列");
  setTimeout(() => ElfMessage.success("第 2 条：资源上传完成"), 200);
  setTimeout(() => ElfMessage.warning("第 3 条：还有一项配置待确认"), 400);
};

const code3 = `ElfMessage.info("第 1 条：任务已加入队列")
ElfMessage.success("第 2 条：资源上传完成")
ElfMessage.warning("第 3 条：还有一项配置待确认")`;

const PageMessageEx3 = defineHtml(`
  <h2>堆叠</h2>
  <elf-playground title="多条消息自动排列" :code=${code3}>
    <elf-button @click=${showStack}>连续触发 3 条</elf-button>
  </elf-playground>
`);

export { PageMessageEx3 };
