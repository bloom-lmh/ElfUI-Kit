import { defineHtml, useRef } from "@elfui/core";

const current = useRef("尚未导航");

const onClick = (event: CustomEvent<[Record<string, unknown>, string]>): void => {
  current.set(event.detail[1]);
};

const code = `<elf-breadcrumb separator-icon="chevron_right" @click=\${onClick}>
  <elf-breadcrumb-item to="/">首页</elf-breadcrumb-item>
  <elf-breadcrumb-item :to=\${{ path: "/basic/button" }} replace>组件</elf-breadcrumb-item>
  <elf-breadcrumb-item>Breadcrumb</elf-breadcrumb-item>
</elf-breadcrumb>`;

const script = `const onClick = (event) => console.log(event.detail[1]);`;

const PageBreadcrumbEx3 = defineHtml(`
  <elf-playground title="组合式导航" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">最近导航：<strong>{{ current }}</strong></span>
    <div style="display:grid;place-items:center;width:100%;min-height:160px">
      <elf-breadcrumb separator-icon="chevron_right" @click=${onClick}>
        <elf-breadcrumb-item to="/">首页</elf-breadcrumb-item>
        <elf-breadcrumb-item :to=${{ path: "/basic/button" }} replace>组件</elf-breadcrumb-item>
        <elf-breadcrumb-item>Breadcrumb</elf-breadcrumb-item>
      </elf-breadcrumb>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx3 };
