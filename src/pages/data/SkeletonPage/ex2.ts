import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  cardTitle: { zh: "卡片骨架", en: "Card skeleton" },
  cardPlayground: {
    zh: "紧凑图片、正文与操作占位",
    en: "Compact image, body, and action placeholders",
  },
  listTitle: { zh: "列表骨架", en: "List skeleton" },
  listPlayground: { zh: "紧凑头像与两行文字", en: "Compact avatar and two-line items" },
  dashboardTitle: { zh: "仪表盘骨架", en: "Dashboard skeleton" },
  dashboardPlayground: { zh: "自适应迷你数据卡片", en: "Responsive mini data cards" },
});

const listRows = [52, 44, 58];
const dashboardCards = [1, 2, 3, 4];
const barHeights = [28, 42, 24, 50, 34, 40];

const cardCode = `<elf-card style="max-width:360px;width:100%">
  <elf-skeleton loading variant="image" width="100%" height="132px" />
  <div style="padding:14px">
    <elf-skeleton loading variant="text" width="60%" height="18px" />
    <elf-skeleton loading variant="text" count="2" gap="7px" />
  </div>
</elf-card>`;

const listCode = `<div style="width:300px">
  <div v-for="row in rows" style="display:flex;gap:12px;align-items:center">
    <elf-skeleton loading variant="circle" width="40px" height="40px" />
    <elf-skeleton loading variant="text" count="2" gap="6px" />
  </div>
</div>`;

const dashboardCode = `<div class="dashboard-grid">
  <elf-card v-for="card in cards">
    <elf-skeleton loading variant="text" width="55%" />
    <div class="mini-bars">...</div>
  </elf-card>
</div>`;

const PageSkeletonEx2 = defineHtml(`
  <h2>${t("cardTitle")}</h2>
  <elf-playground :title=${t("cardPlayground")} :code=${cardCode}>
    <elf-card style="max-width:360px;width:100%;pointer-events:none">
      <elf-skeleton loading variant="image" width="100%" height="132px"></elf-skeleton>
      <div style="padding:14px 14px 0">
        <elf-skeleton loading variant="text" width="60%" height="18px"></elf-skeleton>
        <elf-skeleton loading variant="text" width="42%" height="12px" style="margin-top:7px"></elf-skeleton>
      </div>
      <div style="padding:14px">
        <elf-skeleton loading variant="text" count="2" gap="7px"></elf-skeleton>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;padding:0 14px 12px">
        <elf-skeleton loading variant="rect" width="54px" height="28px"></elf-skeleton>
        <elf-skeleton loading variant="rect" width="54px" height="28px"></elf-skeleton>
      </div>
    </elf-card>
  </elf-playground>

  <h2>${t("listTitle")}</h2>
  <elf-playground :title=${t("listPlayground")} :code=${listCode}>
    <div style="display:grid;gap:12px;width:min(100%,300px)">
      <div v-for="width in listRows" :key="width" style="display:flex;gap:12px;align-items:center">
        <elf-skeleton loading variant="circle" width="40px" height="40px"></elf-skeleton>
        <div style="display:grid;flex:1;gap:6px">
          <elf-skeleton loading variant="text" :width="width + '%'" height="13px"></elf-skeleton>
          <elf-skeleton loading variant="text" :width="(width + 20) + '%'" height="11px"></elf-skeleton>
        </div>
      </div>
    </div>
  </elf-playground>

  <h2>${t("dashboardTitle")}</h2>
  <elf-playground :title=${t("dashboardPlayground")} :code=${dashboardCode}>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;width:100%;max-width:540px">
      <elf-card v-for="card in dashboardCards" :key="card" style="pointer-events:none">
        <div style="padding:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <elf-skeleton loading variant="text" :width="(42 + card * 4) + '%'" height="14px"></elf-skeleton>
            <elf-skeleton loading variant="circle" width="24px" height="24px"></elf-skeleton>
          </div>
          <div style="display:flex;align-items:flex-end;gap:5px;height:50px">
            <elf-skeleton v-for="(height, index) in barHeights" :key="index" loading variant="rect" width="14%" :height="height + 'px'"></elf-skeleton>
          </div>
          <div style="height:1px;margin:10px 0;background:var(--elf-divider)"></div>
          <elf-skeleton loading variant="text" width="64%" height="13px"></elf-skeleton>
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageSkeletonEx2 };
