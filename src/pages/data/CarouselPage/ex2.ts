import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface DemoSlide {
  id: number;
  title: string;
  copy: string;
  tone: string;
}

const INITIAL_SLIDES: DemoSlide[] = [
  { id: 1, title: "01", copy: "Keyboard", tone: "blue" },
  { id: 2, title: "02", copy: "Touch", tone: "violet" },
  { id: 3, title: "03", copy: "Dynamic", tone: "green" }
];

const t = createDocsTranslator({
  title: { zh: "键盘、触屏与动态数据", en: "Keyboard, touch, and dynamic slides" },
  status: { zh: "张幻灯片", en: "slides" },
  active: { zh: "当前", en: "active" },
  add: { zh: "新增", en: "Add" },
  remove: { zh: "移除末项", en: "Remove last" },
  hint: {
    zh: "聚焦后使用 ← →、Home、End；触屏左右滑动。动态增删会同步指示器，并在末项移除后安全回退。",
    en: "After focus, use ← →, Home, or End; swipe horizontally on touch. Dynamic changes update indicators and safely clamp a removed last slide."
  }
});

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
  const tones = ["amber", "rose", "cyan"];
  dynamicSlides.set([
    ...dynamicSlides.value,
    {
      id,
      title: String(id).padStart(2, "0"),
      copy: `Slide ${id}`,
      tone: tones[(id - 4) % tones.length]
    }
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
    .find((entry): entry is HTMLElement =>
      entry instanceof HTMLElement && Boolean(entry.dataset.action)
    )
    ?.dataset.action;
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
    <article>{{ slide.title }}</article>
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
          :label="slide.copy"
        >
          <article :class="'carousel-story tone-' + slide.tone">
            <span>{{ slide.title }}</span>
            <strong>{{ slide.copy }}</strong>
          </article>
        </elf-carousel-item>
      </elf-carousel>
      <p class="carousel-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCarouselEx2 };
