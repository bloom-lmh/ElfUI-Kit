import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";

const showClosable = (): void => {
  ElfMessage({ message: "这条提示会保持显示，可手动关闭", closable: true, duration: 0 });
};

const code2 = `ElfMessage({ message: "这条提示会保持显示，可手动关闭", closable: true, duration: 0 })`;

const PageMessageEx2 = defineHtml(`
  <h2>可关闭</h2>
  <elf-playground title="常驻提示" :code=${code2}>
    <elf-button @click=${showClosable}>显示常驻提示</elf-button>
  </elf-playground>
`);

export { PageMessageEx2 };
