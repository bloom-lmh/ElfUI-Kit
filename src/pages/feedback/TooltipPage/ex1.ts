import { defineHtml } from "@elfui/core";

const code1 = `<elf-tooltip content="Tooltip 在上方" placement="top">
  <elf-button>Top</elf-button>
</elf-tooltip>
<elf-tooltip content="Tooltip 在下方" placement="bottom">
  <elf-button>Bottom</elf-button>
</elf-tooltip>
<elf-tooltip content="Tooltip 在左侧" placement="left">
  <elf-button>Left</elf-button>
</elf-tooltip>
<elf-tooltip content="Tooltip 在右侧" placement="right">
  <elf-button>Right</elf-button>
</elf-tooltip>`;

const PageTooltipEx1 = defineHtml(`
  <h2>基础用法（不同弹出位置）</h2>
  <elf-playground title="placement: top | bottom | left | right" :code="code1">
    <div
      style="display: flex; gap: 16px; align-items: center; justify-content: center; height: 120px;"
    >
      <elf-tooltip content="Tooltip 在上方" placement="top">
        <elf-button>Top</elf-button>
      </elf-tooltip>
      <elf-tooltip content="Tooltip 在下方" placement="bottom">
        <elf-button>Bottom</elf-button>
      </elf-tooltip>
      <elf-tooltip content="Tooltip 在左侧" placement="left">
        <elf-button>Left</elf-button>
      </elf-tooltip>
      <elf-tooltip content="Tooltip 在右侧" placement="right">
        <elf-button>Right</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx1 };
