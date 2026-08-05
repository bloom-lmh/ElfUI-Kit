import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type SlideCopyKey = "keyboard" | "touch" | "dynamic" | "city" | "mountains" | "stream";

interface DemoSlide {
  id: number;
  title: string;
  copyKey: SlideCopyKey;
  image: string;
}

const picsum = (id: number): string => `https://picsum.photos/id/${id}/1200/520`;

const INITIAL_SLIDES: DemoSlide[] = [
  { id: 1, title: "01", copyKey: "keyboard", image: picsum(1018) },
  { id: 2, title: "02", copyKey: "touch", image: picsum(1015) },
  { id: 3, title: "03", copyKey: "dynamic", image: picsum(1019) },
];

const EXTRA_SLIDES = [
  { copyKey: "city", image: picsum(20) },
  { copyKey: "mountains", image: picsum(29) },
  { copyKey: "stream", image: picsum(15) },
] as const;

const t = createDocsTranslator({
  title: { zh: "键盘、触屏与动态数据", en: "Keyboard, touch, and dynamic slides" },
  status: { zh: "张幻灯片", en: "slides" },
  active: { zh: "当前", en: "active" },
  add: { zh: "新增", en: "Add" },
  remove: { zh: "移除末项", en: "Remove last" },
  hint: {
    zh: "聚焦后使用 ← →、Home、End；触屏左右滑动。动态增删会同步指示器，并在末项移除后安全回退。",
    en: "After focus, use ← →, Home, or End; swipe horizontally on touch. Dynamic changes update indicators and safely clamp a removed last slide.",
  },
  keyboard: { zh: "键盘", en: "Keyboard" },
  touch: { zh: "触屏", en: "Touch" },
  dynamic: { zh: "动态数据", en: "Dynamic" },
  city: { zh: "城市工作区", en: "City workspace" },
  mountains: { zh: "海岸群山", en: "Coastal mountains" },
  stream: { zh: "森林溪流", en: "Forest stream" },
});

const SLIDE_LABELS = {
  keyboard: (): string => t("keyboard"),
  touch: (): string => t("touch"),
  dynamic: (): string => t("dynamic"),
  city: (): string => t("city"),
  mountains: (): string => t("mountains"),
  stream: (): string => t("stream"),
} as const;
const copyOf = (slide: DemoSlide): string => SLIDE_LABELS[slide.copyKey]?.() ?? slide.copyKey;

// State
const dynamicSlides = useRef<DemoSlide[]>(INITIAL_SLIDES);
const activeIndex = useRef(0);
const nextId = useRef(4);

// Derived state
const dynamicStatus = (): string =>
  `${dynamicSlides.value.length} ${t("status")} · ${t("active")} ${activeIndex.value + 1}`;

// Methods
const onChange = (event: CustomEvent<[number, number]>): void => {
  activeIndex.set(event.detail[0]);
};

const addSlide = (): void => {
  if (dynamicSlides.value.length >= 6) return;
  const id = nextId.value;
  const entry = EXTRA_SLIDES[(id - 4) % EXTRA_SLIDES.length] ?? EXTRA_SLIDES[0]!;
  dynamicSlides.set([
    ...dynamicSlides.value,
    { id, title: String(id).padStart(2, "0"), copyKey: entry.copyKey, image: entry.image },
  ]);
  nextId.set(id + 1);
};

const removeSlide = (): void => {
  if (dynamicSlides.value.length <= 2) return;
  dynamicSlides.set(dynamicSlides.value.slice(0, -1));
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find(
      (entry): entry is HTMLElement =>
        entry instanceof HTMLElement && Boolean(entry.dataset.action),
    )?.dataset.action;
  if (action === "add") addSlide();
  if (action === "remove") removeSlide();
};

const dynamicCode = `<elf-carousel
  :autoplay.prop=\${false}
  :loop.prop=\${false}
  indicator-type="number"
  trigger="click"
  arrow="always"
  @change=\${onChange}
>
  <elf-carousel-item
    v-for="slide in slides"
    :key="slide.id"
    :name="slide.id"
    :label="slide.copy"
  >
    <article>
      <img :src="slide.image" :alt="slide.copy" decoding="async" />
      <div class="caption">
        <span>{{ slide.title }}</span>
        <strong>{{ slide.copy }}</strong>
      </div>
    </article>
  </elf-carousel-item>
</elf-carousel>`;

const dynamicScript = `const slides = useRef(createSlides(3));
const activeIndex = useRef(0);

const onChange = (event) => activeIndex.set(event.detail[0]);
const addSlide = () => slides.set([...slides.value, createSlide()]);
const removeSlide = () => {
  if (slides.value.length > 2) slides.set(slides.value.slice(0, -1));
};`;

defineStyle(styles);

const PageCarouselEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${dynamicCode} :script=${dynamicScript}>
    <div
      slot="status"
      class="carousel-demo-actions"
      role="status"
      aria-live="polite"
      @click=${onStatusAction}
    >
      <span>${dynamicStatus()}</span>
      <button type="button" data-action="add">${t("add")}</button>
      <button type="button" data-action="remove">${t("remove")}</button>
    </div>
    <div class="carousel-demo-frame">
      <elf-carousel
        class="carousel-dynamic"
        height="320px"
        :autoplay.prop=${false}
        :loop.prop=${false}
        indicator-type="number"
        trigger="click"
        arrow="always"
        :aria-label=${t("title")}
        @change=${onChange}
      >
        <elf-carousel-item
          v-for="slide in dynamicSlides.value"
          :key="slide.id"
          :name="slide.id"
          :label=copyOf(slide)
        >
          <article class="carousel-story">
            <img
              :src="slide.image"
              :alt=copyOf(slide)
              decoding="async"
            />
            <div class="carousel-story-caption">
              <span>{{ slide.title }}</span>
              <strong>{{ copyOf(slide) }}</strong>
            </div>
          </article>
        </elf-carousel-item>
      </elf-carousel>
      <p class="carousel-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCarouselEx2 };
