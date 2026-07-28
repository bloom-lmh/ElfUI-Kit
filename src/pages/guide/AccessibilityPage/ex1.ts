import { defineHtml, defineStyle } from "@elfui/core";

import pageStyles from "./style.scss?inline";

defineStyle(pageStyles);

const templateCode = `<elf-config-provider motion="reduced">
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <main id="main-content" tabindex="-1">
    <button type="button">键盘可聚焦操作</button>
    <p aria-live="polite">操作结果会在这里播报</p>
  </main>
</elf-config-provider>`;

const scriptCode = `// reduced 会统一收敛组件动效。
// 页面仍需维护正确的标题层级、焦点顺序、可读标签和错误关联。
const motion = "reduced";`;

const PageAccessibilityEx1 = defineHtml(`
  <elf-playground
    title="焦点与弱化动效"
    :code=${templateCode}
    :script=${scriptCode}
  >
    <elf-config-provider motion="reduced">
      <section class="a11y-focus-demo" aria-labelledby="a11y-focus-title">
        <a class="skip-link-demo" href="#a11y-demo-main">跳到主要内容</a>
        <div id="a11y-demo-main" class="focus-surface" tabindex="-1">
          <strong id="a11y-focus-title">键盘访问区域</strong>
          <span>按 Tab 检查焦点顺序与可见焦点环。</span>
          <button class="focus-demo" type="button">键盘可聚焦操作</button>
        </div>
      </section>
    </elf-config-provider>
  </elf-playground>
`);

export { PageAccessibilityEx1 };
