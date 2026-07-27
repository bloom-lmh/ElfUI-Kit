import { defineHtml } from "@elfui/core";

const code1 = `<elf-watermark
  content="ElfUI"
  :width="140"
  :height="72"
  :gap-x="60"
  :gap-y="48"
>
  <div class="demo-paper">这里是业务内容区域</div>
</elf-watermark>`;

const PageWatermarkEx1 = defineHtml(`
<elf-playground title="基础水印" :code=${code1}>
            <elf-watermark content="ElfUI" :width=${140} :height=${72} :gap-x=${60} :gap-y=${48}>
                <div style="height:180px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px">
                    这里是业务内容区域，滚动、表格和表单都可以放在水印容器内。
                </div>
            </elf-watermark>
        </elf-playground>
`);

export { PageWatermarkEx1 };
