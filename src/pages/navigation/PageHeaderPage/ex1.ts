import { defineHtml, useRef } from "@elfui/core";

const message = useRef("等待返回操作");

const code1 = `<elf-page-header
  title="返回"
  content="订单详情"
  @back=\${onBack}
>
  <elf-button slot="extra" size="sm">编辑</elf-button>
</elf-page-header>`;

const script1 = `const message = useRef("等待返回操作");

const onBack = () => {
  message.set("触发 back 事件");
};`;

const onBack = (): void => {
  message.set("触发 back 事件");
};

const PagePageHeaderEx1 = defineHtml(`
<elf-playground title="基础页头 / back" :code=${code1} :script=${script1}>
      <elf-page-header title="返回" content="订单详情" @back=${onBack}>
        <elf-button slot="extra" size="sm">编辑</elf-button>
      </elf-page-header>
      <span slot="status" class="demo-state">${message}</span>
    </elf-playground>
`);

export { PagePageHeaderEx1 };
