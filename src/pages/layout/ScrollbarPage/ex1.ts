import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "固定高度", en: "Fixed height" },
  playgroundTitle: { zh: "消息列表与滚动事件", en: "Message list and scroll event" },
  brunchTitle: { zh: "周末早午餐？", en: "Brunch this weekend?" },
  brunchFrom: { zh: "阿里", en: "Ali Connors" },
  brunchText: { zh: "这周末我会到你附近办事，要不要一起见面？", en: "I will be nearby this weekend. Do you want to meet?" },
  bbqTitle: { zh: "夏日烧烤", en: "Summer barbecue" },
  bbqFrom: { zh: "发给亚历克斯、斯科特和珍妮弗", en: "To Alex, Scott, and Jennifer" },
  bbqText: { zh: "很遗憾参加不了，这周末我要出城。", en: "I wish I could come, but I will be out of town." },
  parisTitle: { zh: "巴黎建议", en: "Paris recommendations" },
  parisFrom: { zh: "桑德拉", en: "Sandra Adams" },
  parisText: { zh: "你有巴黎旅行建议吗？以前去过那里吗？", en: "Do you have any Paris recommendations?" },
  giftTitle: { zh: "生日礼物", en: "Birthday gift" },
  giftFrom: { zh: "特雷弗", en: "Trevor Hansen" },
  giftText: { zh: "我们应该为海蒂准备什么生日礼物？", en: "What should we get Heidi for her birthday?" },
  recipeTitle: { zh: "待尝试食谱", en: "Recipe to try" },
  recipeFrom: { zh: "布里塔", en: "Britta Holt" },
  recipeText: { zh: "下次开会可以试试这道菜，看起来很棒。", en: "We should try this at the next meeting." }
});

const messages = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/80?img=12",
    title: t("brunchTitle"),
    from: t("brunchFrom"),
    text: t("brunchText"),
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/80?img=33",
    title: t("bbqTitle"),
    from: t("bbqFrom"),
    text: t("bbqText"),
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/80?img=48",
    title: t("parisTitle"),
    from: t("parisFrom"),
    text: t("parisText"),
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/80?img=5",
    title: t("giftTitle"),
    from: t("giftFrom"),
    text: t("giftText"),
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/80?img=25",
    title: t("recipeTitle"),
    from: t("recipeFrom"),
    text: t("recipeText"),
  },
];

const scrollTop = useRef(0);
const onScroll = (event: CustomEvent): void => {
  const detail = (event.detail || {}) as { scrollTop?: number };
  scrollTop.set(Math.round(Number(detail.scrollTop) || 0));
};

const code =
  '<elf-scrollbar class="mail-scrollbar" :height=${225 + "px"} always @scroll="onScroll">\n' +
  '  <ul class="mail-list">\n' +
  '    <li v-for="item in messages" :key="item.id" class="mail-item">\n' +
  '      <img class="mail-avatar" :src="item.avatar" alt="" />\n' +
  '      <span class="mail-body">\n' +
  "        <strong>{{ item.title }}</strong>\n" +
  "        <span><em>{{ item.from }}</em> — {{ item.text }}</span>\n" +
  "      </span>\n" +
  "    </li>\n" +
  "  </ul>\n" +
  "</elf-scrollbar>";

const script =
  "const scrollTop = useRef(0);\n" + "const onScroll = (event) => scrollTop.set(Math.round(event.detail.scrollTop));";

const PageScrollbarEx1 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <elf-scrollbar class="mail-scrollbar" :height=${225 + "px"} always @scroll=${onScroll}>
      <ul class="mail-list">
        <li v-for="item in messages" :key="item.id" class="mail-item">
          <img class="mail-avatar" :src="item.avatar" alt="" />
          <span class="mail-body">
            <strong>{{ item.title }}</strong>
            <span><em>{{ item.from }}</em> — {{ item.text }}</span>
          </span>
        </li>
      </ul>
    </elf-scrollbar>
    <span slot="status" class="demo-state">scrollTop: ${scrollTop.value}</span>
  </elf-playground>
`);
defineStyle(styles);
export { PageScrollbarEx1 };
