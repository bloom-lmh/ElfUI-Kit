import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./style.scss?inline";
const t = createDocsTranslator({
  title: { zh: "命令式控制", en: "Imperative controls" },
  playgroundTitle: { zh: "滚动位置命令", en: "Scroll position commands" },
  meetingTitle: { zh: "会议纪要", en: "Meeting notes" },
  followTitle: { zh: "后续事项", en: "Follow up" },
  sender1: { zh: "斯科特", en: "Scott" },
  sender2: { zh: "珍妮弗", en: "Jennifer" },
  preview: {
    zh: "紧凑列表让滚动条案例更贴近日常产品界面。",
    en: "A compact list keeps this example close to everyday product interfaces.",
  },
  top: { zh: "顶部", en: "Top" },
  bottom: { zh: "底部", en: "Bottom" },
  distance: { zh: "距顶部", en: "From top" },
  toTop: { zh: "回到顶部", en: "Scroll to top" },
  toBottom: { zh: "滚动到底部", en: "Scroll to bottom" },
  currentPosition: { zh: "当前位置", en: "Current position" },
});
const mail = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  avatar: "https://i.pravatar.cc/80?img=" + (index + 20),
  title: index % 2 ? t("meetingTitle") : t("followTitle"),
  from: index % 2 ? t("sender1") : t("sender2"),
  text: t("preview"),
}));

const host = useHost();
const position = useRef(t("top"));

const getScrollbar = (): (HTMLElement & ScrollbarExpose) | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("[data-command-scrollbar]") ?? null;

const toTop = (): void => getScrollbar()?.setScrollTop(0);
const toBottom = (): void => {
  const scrollbar = getScrollbar();
  scrollbar?.setScrollTop(scrollbar.wrapRef?.scrollHeight ?? Number.MAX_SAFE_INTEGER);
};

const onCommandScroll = (event: CustomEvent<{ scrollTop: number }>): void => {
  const scrollbar = getScrollbar();
  const wrap = scrollbar?.wrapRef;
  const top = Number(event.detail?.scrollTop) || 0;
  const max = wrap ? Math.max(0, wrap.scrollHeight - wrap.clientHeight) : 0;
  position.set(
    top <= 1 ? t("top") : top >= max - 1 ? t("bottom") : `${t("distance")} ${Math.round(top)}px`,
  );
};

const code =
  '<elf-scrollbar class="mail-scrollbar" data-command-scrollbar :height=${220 + "px"} always @scroll=${onCommandScroll}>\n' +
  '  <ul class="mail-list">\n' +
  '    <li v-for="item in mail" :key="item.id" class="mail-item">\n' +
  '      <img class="mail-avatar" :src="item.avatar" alt="" />\n' +
  '      <span class="mail-body">\n' +
  "        <strong>{{ item.title }}</strong>\n" +
  "        <span><em>{{ item.from }}</em> — {{ item.text }}</span>\n" +
  "      </span>\n" +
  "    </li>\n" +
  "  </ul>\n" +
  "</elf-scrollbar>\n" +
  '<div class="cmd-row">\n' +
  `  <elf-button size="sm" variant="outlined" @click=\${toTop}>${t("toTop")}</elf-button>\n` +
  `  <elf-button size="sm" variant="outlined" @click=\${toBottom}>${t("toBottom")}</elf-button>\n` +
  `  <span class="command-status">${t("currentPosition")}: \${position}</span>\n` +
  "</div>";

const script =
  "const host = useHost();\n" +
  `const position = useRef("${t("top")}");\n` +
  'const getScrollbar = () => host.shadowRoot?.querySelector("[data-command-scrollbar]");\n' +
  "const toTop = () => getScrollbar()?.setScrollTop(0);\n" +
  "const toBottom = () => {\n" +
  "  const scrollbar = getScrollbar();\n" +
  "  scrollbar?.setScrollTop(scrollbar.wrapRef?.scrollHeight ?? Number.MAX_SAFE_INTEGER);\n" +
  "};";

const PageScrollbarEx3 = defineHtml(`
    <h2>${t("playgroundTitle")}</h2>
    <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
        <elf-scrollbar
            class="mail-scrollbar"
            data-command-scrollbar
            :height=${220 + "px"}
            always
            @scroll=${onCommandScroll}
        >
            <ul class="mail-list">
                <li v-for="item in mail" :key="item.id" class="mail-item">
                    <img class="mail-avatar" :src="item.avatar" alt="" />
                    <span class="mail-body">
                        <strong>{{ item.title }}</strong>
                        <span><em>{{ item.from }}</em> — {{ item.text }}</span>
                    </span>
                </li>
            </ul>
        </elf-scrollbar>
        <div class="cmd-row">
            <elf-button size="sm" variant="outlined" @click=${toTop}>${t("toTop")}</elf-button>
            <elf-button size="sm" variant="outlined" @click=${toBottom}>${t("toBottom")}</elf-button>
            <span class="command-status">${t("currentPosition")}: {{ position }}</span>
        </div>
    </elf-playground>
`);
defineStyle(styles);
export { PageScrollbarEx3 };
