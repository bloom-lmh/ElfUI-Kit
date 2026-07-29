import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { touchDirective, type TouchGestureDetail } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" }, title: { zh: "触摸手势", en: "Touch" }, description: { zh: "基于 touch 或 pen 指针识别四个方向的滑动，并保留单独方向回调。", en: "Recognize four-direction swipes from touch or pen pointers while keeping individual direction callbacks." },
  demo: { zh: "在触摸设备上滑动", en: "Swipe on a touch device" }, idle: { zh: "等待手势", en: "Waiting for a gesture" }, detected: { zh: "已识别", en: "Detected" }, api: { zh: "API", en: "API" }, type: { zh: "类型", en: "Type" }, desc: { zh: "说明", en: "Description" }, handler: { zh: "统一接收方向、距离和时长。", en: "Receives direction, distance, and duration." }, directions: { zh: "left/right/up/down 可单独传入。", en: "left/right/up/down can be supplied individually." }, threshold: { zh: "最小滑动距离，默认 36px。", en: "Minimum swipe distance; defaults to 36px." }, disabled: { zh: "停用当前手势识别。", en: "Disables current gesture recognition." }
});

defineStyle(articleStyles, demoStyles);
const touch = defineDirective(touchDirective);
const gesture = useRef("");
const onGesture = (detail: TouchGestureDetail): void => gesture.set(`${detail.direction} · ${Math.round(Math.max(Math.abs(detail.deltaX), Math.abs(detail.deltaY)))}px`);
const options = () => ({ handler: onGesture, threshold: 28 });
const code = `<section v-touch={ handler: onGesture, threshold: 28 }>
  Swipe in any direction
</section>`;
const script = `import { defineDirective } from "@elfui/core";
import { touchDirective } from "@elfui/kit";
const touch = defineDirective(touchDirective);
const onGesture = ({ direction }) => setDirection(direction);`;

const PageTouch = defineHtml(`
  <elf-container class="docs-article"><span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("detected")}: ${gesture || t("idle")}</span><section v-touch=${options()} class="directive-gesture">${t("demo")}</section></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><table class="docs-matrix"><thead><tr><th>Option</th><th>${t("type")}</th><th>${t("desc")}</th></tr></thead><tbody><tr><td>handler</td><td>(detail) =&gt; void</td><td>${t("handler")}</td></tr><tr><td>left / right / up / down</td><td>(detail) =&gt; void</td><td>${t("directions")}</td></tr><tr><td>threshold</td><td>number</td><td>${t("threshold")}</td></tr><tr><td>disabled</td><td>boolean</td><td>${t("disabled")}</td></tr></tbody></table></section>
  </elf-container>
`);
export { PageTouch };
