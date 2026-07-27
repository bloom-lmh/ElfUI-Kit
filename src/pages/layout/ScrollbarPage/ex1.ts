import { defineHtml, defineStyle, useRef } from "@elfui/core";
import styles from "./style.scss?inline";
const messages = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/80?img=12",
    title: "Brunch this weekend?",
    from: "Ali Connors",
    text: "I will be in your neighborhood doing errands this weekend. Do you want to hang out?",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/80?img=33",
    title: "Summer BBQ",
    from: "to Alex, Scott, Jennifer",
    text: "Wish I could come, but I am out of town this weekend.",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/80?img=48",
    title: "Oui oui",
    from: "Sandra Adams",
    text: "Do you have Paris recommendations? Have you ever been?",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/80?img=5",
    title: "Birthday gift",
    from: "Trevor Hansen",
    text: "Have any ideas about what we should get Heidi for her birthday?",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/80?img=25",
    title: "Recipe to try",
    from: "Britta Holt",
    text: "We should eat this at the next meeting, it looks amazing.",
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
  <h2>固定高度</h2>
  <elf-playground title="消息列表 / 滚动事件" :code=${code} :script=${script}>
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
