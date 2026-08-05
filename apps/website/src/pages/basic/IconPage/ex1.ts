import { defineHtml, defineStyle } from "@elfui/core";
import { mdiAlertOutline, mdiCheckCircleOutline, mdiCloseCircleOutline, mdiMagnify } from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "尺寸与颜色", en: "Size and color" },
  status: {
    zh: "尺寸与颜色贴合界面层级：列表行 20px，重点状态 24px，颜色使用语义 token。",
    en: "Size and color follow the UI hierarchy: 20px for list rows, 24px for prominent states, with semantic tokens.",
  },
  notifications: { zh: "发布通知", en: "Release notifications" },
  successTitle: { zh: "构建 #4821 已通过", en: "Build #4821 passed" },
  successTime: { zh: "2 分钟前", en: "2 min ago" },
  warningTitle: { zh: "磁盘使用率达到 86%", en: "Disk usage reached 86%" },
  warningTime: { zh: "1 小时前", en: "1 hour ago" },
  dangerTitle: { zh: "订单服务错误率 5.2%", en: "Order service error rate 5.2%" },
  dangerTime: { zh: "刚刚", en: "Just now" },
  sizeScale: { zh: "尺寸层级", en: "Size scale" },
});

const iconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      success: mdiCheckCircleOutline,
      warning: mdiAlertOutline,
      danger: mdiCloseCircleOutline,
      search: mdiMagnify,
    }),
  },
};

const appearanceCode = `<elf-icon-provider :options.prop="iconOptions">
  <div class="icon-notice-panel">
    <strong class="icon-notice-head">Release notifications</strong>
    <div class="icon-notice-list">
      <div class="icon-notice-row">
        <elf-icon name="success" size="20" color="var(--elf-success)" />
        <span class="icon-notice-body">
          <strong>Build #4821 passed</strong>
          <small>2 min ago</small>
        </span>
      </div>
      <div class="icon-notice-row">
        <elf-icon name="warning" size="24" color="var(--elf-warning)" />
        <span class="icon-notice-body">
          <strong>Disk usage reached 86%</strong>
          <small>1 hour ago</small>
        </span>
      </div>
      <div class="icon-notice-row">
        <elf-icon name="danger" size="24" color="var(--elf-danger)" />
        <span class="icon-notice-body">
          <strong>Order service error rate 5.2%</strong>
          <small>Just now</small>
        </span>
      </div>
    </div>
    <div class="icon-size-ladder">
      <span>Size scale</span>
      <elf-icon name="search" size="16"></elf-icon>
      <elf-icon name="search" size="24"></elf-icon>
      <elf-icon name="search" size="32"></elf-icon>
      <elf-icon name="search" size="2.5em"></elf-icon>
    </div>
  </div>
</elf-icon-provider>`;

const appearanceScript = `// 列表行图标 20px，重点状态 24px；颜色使用语义 token。
// Rows use 20px icons; prominent states use 24px with semantic tokens.`;

defineStyle(styles);

const PageIconEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${iconOptions}>
      <div class="icon-notice-panel">
        <strong class="icon-notice-head">${t("notifications")}</strong>
        <div class="icon-notice-list">
          <div class="icon-notice-row">
            <elf-icon name="success" size="20" color="var(--elf-success)"></elf-icon>
            <span class="icon-notice-body">
              <strong>${t("successTitle")}</strong>
              <small>${t("successTime")}</small>
            </span>
          </div>
          <div class="icon-notice-row">
            <elf-icon name="warning" size="24" color="var(--elf-warning)"></elf-icon>
            <span class="icon-notice-body">
              <strong>${t("warningTitle")}</strong>
              <small>${t("warningTime")}</small>
            </span>
          </div>
          <div class="icon-notice-row">
            <elf-icon name="danger" size="24" color="var(--elf-danger)"></elf-icon>
            <span class="icon-notice-body">
              <strong>${t("dangerTitle")}</strong>
              <small>${t("dangerTime")}</small>
            </span>
          </div>
        </div>
        <div class="icon-size-ladder">
          <span>${t("sizeScale")}</span>
          <elf-icon name="search" size="16"></elf-icon>
          <elf-icon name="search" size="24"></elf-icon>
          <elf-icon name="search" size="32"></elf-icon>
          <elf-icon name="search" size="2.5em"></elf-icon>
        </div>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx1 };
