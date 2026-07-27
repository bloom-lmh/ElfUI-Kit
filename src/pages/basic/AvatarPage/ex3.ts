import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "团队溢出与键盘提示", en: "Team overflow and keyboard tooltip" },
  status: { zh: "6 位成员 · 显示 3 位", en: "6 members · 3 visible" },
  hint: {
    zh: "聚焦 +3 后按 Enter 展开成员列表，按 Esc 关闭；溢出按钮名称由 LocaleProvider 提供。",
    en: "Focus +3 and press Enter to open the member list, then Esc to close it. LocaleProvider supplies the accessible label."
  }
});

const groupCode = `<elf-avatar-group
  size="lg"
  collapse-avatars
  collapse-avatars-tooltip
  max-collapse-avatars="3"
  placement="bottom"
>
  <elf-avatar alt="Ada Lovelace"></elf-avatar>
  <elf-avatar alt="Grace Hopper"></elf-avatar>
  <elf-avatar alt="Margaret Hamilton"></elf-avatar>
  <elf-avatar alt="Alan Turing"></elf-avatar>
  <elf-avatar alt="Edsger Dijkstra"></elf-avatar>
  <elf-avatar alt="Barbara Liskov"></elf-avatar>
</elf-avatar-group>`;

const groupScript = `// 每个 Avatar 的 alt 会成为溢出提示中的成员名称。
// collapse-avatars-tooltip 让 +N 按钮支持 Enter / Space 和 Esc。`;

defineStyle(styles);

const PageAvatarEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${groupCode} :script=${groupScript}>
    <span slot="status" class="avatar-demo-status">${t("status")}</span>
    <div class="avatar-group-demo">
      <elf-avatar-group
        size="lg"
        collapse-avatars
        collapse-avatars-tooltip
        max-collapse-avatars="3"
        placement="bottom"
      >
        <elf-avatar alt="Ada Lovelace" color="primary"></elf-avatar>
        <elf-avatar alt="Grace Hopper" color="success"></elf-avatar>
        <elf-avatar alt="Margaret Hamilton" color="#7b1fa2"></elf-avatar>
        <elf-avatar alt="Alan Turing" color="warning"></elf-avatar>
        <elf-avatar alt="Edsger Dijkstra" color="info"></elf-avatar>
        <elf-avatar alt="Barbara Liskov" color="danger"></elf-avatar>
      </elf-avatar-group>
      <p>${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageAvatarEx3 };
