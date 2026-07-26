import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";
import styles from "./style.scss?inline";
const mail = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    avatar: "https://i.pravatar.cc/80?img=" + (index + 20),
    title: index % 2 ? "Meeting notes" : "Follow up",
    from: index % 2 ? "Scott" : "Jennifer",
    text: "A compact list item keeps the scrollbar demo close to real product usage.",
}));

const host = useHost();
const position = useRef("顶部");

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
    position.set(top <= 1 ? "顶部" : top >= max - 1 ? "底部" : `距顶部 ${Math.round(top)}px`);
};

const code =
    '<span slot="status" class="cmd-row">\n' +
    '  <elf-button size="sm" @click=${toTop}>回到顶部</elf-button>\n' +
    '  <elf-button size="sm" @click=${toBottom}>滚到底部</elf-button>\n' +
    '  <span>当前位置：${position}</span>\n' +
    '</span>\n' +
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
    "</elf-scrollbar>";

const script =
    'const host = useHost();\n' +
    'const position = useRef("顶部");\n' +
    'const getScrollbar = () => host.shadowRoot?.querySelector("[data-command-scrollbar]");\n' +
    "const toTop = () => getScrollbar()?.setScrollTop(0);\n" +
    "const toBottom = () => {\n" +
    "  const scrollbar = getScrollbar();\n" +
    "  scrollbar?.setScrollTop(scrollbar.wrapRef?.scrollHeight ?? Number.MAX_SAFE_INTEGER);\n" +
    "};";

const PageScrollbarEx3 = defineHtml(`
    <h2>命令控制</h2>
    <elf-playground title="setScrollTop" :code=${code} :script=${script}>
        <span slot="status" class="cmd-row">
            <elf-button size="sm" variant="outlined" @click=${toTop}>回到顶部</elf-button>
            <elf-button size="sm" variant="outlined" @click=${toBottom}>滚到底部</elf-button>
            <span class="command-status">当前位置：{{ position }}</span>
        </span>
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
    </elf-playground>
`);
defineStyle(styles);
export { PageScrollbarEx3 };
