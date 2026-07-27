import { defineHtml } from "@elfui/core";

const code4 = `<elf-tooltip content="延迟 1 秒显示" :show-after="1000">
  <elf-button>延迟 1s 显示</elf-button>
</elf-tooltip>
<elf-tooltip content="延迟 1 秒隐藏" :hide-after="1000">
  <elf-button>延迟 1s 隐藏</elf-button>
</elf-tooltip>`;

const PageTooltipEx3 = defineHtml(`
  <h2>防抖与延迟控制</h2>
  <elf-playground title="show-after / hide-after（毫秒）" :code="code4">
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip content="延迟 1 秒显示" :show-after="1000">
        <elf-button>延迟 1s 显示</elf-button>
      </elf-tooltip>
      <elf-tooltip content="延迟 1 秒隐藏" :hide-after="1000">
        <elf-button>延迟 1s 隐藏</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx3 };
