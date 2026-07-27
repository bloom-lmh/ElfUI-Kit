import { defineHtml } from "@elfui/core";

const code2 = `<elf-tooltip content="悬浮触发的提示" trigger="hover">
  <elf-button>Hover 我（默认）</elf-button>
</elf-tooltip>
<elf-tooltip content="点击触发的提示" trigger="click">
  <elf-button>Click 我</elf-button>
</elf-tooltip>
<elf-tooltip content="聚焦触发的提示" trigger="focus">
  <elf-input placeholder="Focus 聚焦我" style="width: 150px;"></elf-input>
</elf-tooltip>
<elf-tooltip content="右键触发的提示" trigger="contextmenu">
  <elf-button>右键我</elf-button>
</elf-tooltip>`;

const code3 = `<elf-tooltip content="深色主题提示" effect="dark">
  <elf-button>Dark 主题</elf-button>
</elf-tooltip>
<elf-tooltip content="浅色主题提示" effect="light">
  <elf-button>Light 主题</elf-button>
</elf-tooltip>`;

const PageTooltipEx2 = defineHtml(`
  <h2>不同触发时机</h2>
  <elf-playground title="trigger: hover | click | focus | contextmenu" :code="code2">
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip content="悬浮触发的提示" trigger="hover">
        <elf-button>Hover 我（默认）</elf-button>
      </elf-tooltip>
      <elf-tooltip content="点击触发的提示" trigger="click">
        <elf-button>Click 我</elf-button>
      </elf-tooltip>
      <elf-tooltip content="聚焦触发的提示" trigger="focus">
        <elf-input placeholder="Focus 聚焦我" style="width: 150px;"></elf-input>
      </elf-tooltip>
      <elf-tooltip content="右键触发的提示" trigger="contextmenu">
        <elf-button>右键我</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>

  <h2>风格主题</h2>
  <elf-playground title="effect: dark | light" :code="code3">
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip content="深色主题提示" effect="dark">
        <elf-button>Dark 主题</elf-button>
      </elf-tooltip>
      <elf-tooltip content="浅色主题提示" effect="light">
        <elf-button>Light 主题</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx2 };
