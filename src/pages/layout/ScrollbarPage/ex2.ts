import { defineHtml, defineStyle } from "@elfui/core";
import styles from "./style.scss?inline";
const inbox = Array.from({ length: 12 }, (_, index) => {
  const names = ["Ali Connors", "Sandra Adams", "Trevor Hansen", "Britta Holt"];
  const subjects = ["Project update", "Weekend plans", "Design review", "Dinner tomorrow"];
  return {
    id: index + 1,
    avatar: "https://i.pravatar.cc/80?img=" + (index + 10),
    title: subjects[index % subjects.length],
    from: names[index % names.length],
    text: "Here is a short preview of the message content for this conversation.",
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

const PageScrollbarEx2 = defineHtml(`
  <h2>最大高度</h2>
  <elf-playground title="max-height" :code=${code}>
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
