import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "最大高度", en: "Maximum height" },
  playgroundTitle: { zh: "内容自适应与最大高度", en: "Content sizing with a maximum height" },
  projectTitle: { zh: "项目进度", en: "Project update" },
  weekendTitle: { zh: "周末计划", en: "Weekend plans" },
  designTitle: { zh: "设计评审", en: "Design review" },
  dinnerTitle: { zh: "明日晚餐", en: "Dinner tomorrow" },
  preview: { zh: "这是一段简短的会话消息预览，用于展示超过最大高度时的滚动效果。", en: "This preview demonstrates scrolling when content exceeds the maximum height." },
  sender1: { zh: "阿里", en: "Ali Connors" },
  sender2: { zh: "桑德拉", en: "Sandra Adams" },
  sender3: { zh: "特雷弗", en: "Trevor Hansen" },
  sender4: { zh: "布里塔", en: "Britta Holt" }
});

const inbox = Array.from({ length: 12 }, (_, index) => {
  const names = [t("sender1"), t("sender2"), t("sender3"), t("sender4")];
  const subjects = [t("projectTitle"), t("weekendTitle"), t("designTitle"), t("dinnerTitle")];
  return {
    id: index + 1,
    avatar: "https://i.pravatar.cc/80?img=" + (index + 10),
    title: subjects[index % subjects.length],
    from: names[index % names.length],
    text: t("preview"),
  };
});

const code =
  '<elf-scrollbar class="mail-scrollbar" max-height="260px">\n' +
  '  <ul class="mail-list">\n' +
  '    <li v-for="item in inbox" :key="item.id" class="mail-item">\n' +
  '      <img class="mail-avatar" :src="item.avatar" alt="" />\n' +
  '      <span class="mail-body">\n' +
  "        <strong>{{ item.title }}</strong>\n" +
  "        <span><em>{{ item.from }}</em> — {{ item.text }}</span>\n" +
  "      </span>\n" +
  "    </li>\n" +
  "  </ul>\n" +
  "</elf-scrollbar>";

const script = `const inbox = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: ["${t("projectTitle")}", "${t("weekendTitle")}", "${t("designTitle")}", "${t("dinnerTitle")}"][index % 4],
  from: ["${t("sender1")}", "${t("sender2")}", "${t("sender3")}", "${t("sender4")}"][index % 4],
  text: "${t("preview")}"
}));`;

const PageScrollbarEx2 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <elf-scrollbar class="mail-scrollbar" max-height="260px">
      <ul class="mail-list">
        <li v-for="item in inbox" :key="item.id" class="mail-item">
          <img class="mail-avatar" :src="item.avatar" alt="" />
          <span class="mail-body">
            <strong>{{ item.title }}</strong>
            <span><em>{{ item.from }}</em> — {{ item.text }}</span>
          </span>
        </li>
      </ul>
    </elf-scrollbar>
  </elf-playground>
`);
defineStyle(styles);
export { PageScrollbarEx2 };
