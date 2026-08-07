import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  {
    name: "content",
    type: "string | string[]",
    default: "''",
    desc: pick("水印文字；数组会按行显示", "Watermark text; arrays render as separate lines"),
  },
  {
    name: "image",
    type: "string",
    default: "''",
    desc: pick("水印图片地址，优先于文字", "Watermark image URL, preferred over text"),
  },
  {
    name: "width",
    type: "number",
    default: "120",
    desc: pick("单个水印平铺尺寸", "Watermark tile size"),
  },
  {
    name: "height",
    type: "number",
    default: "64",
    desc: pick("单个水印平铺尺寸", "Watermark tile size"),
  },
  {
    name: "rotate",
    type: "number",
    default: "-22",
    desc: pick("水印旋转角度", "Watermark rotation"),
  },
  {
    name: "gap-x",
    type: "number",
    default: "100",
    desc: pick("水印间距", "Watermark spacing"),
  },
  {
    name: "gap-y",
    type: "number",
    default: "100",
    desc: pick("水印间距", "Watermark spacing"),
  },
  {
    name: "offset-x",
    type: "number",
    default: "gap",
    desc: pick("首个水印偏移", "First watermark offset"),
  },
  {
    name: "offset-y",
    type: "number",
    default: "2",
    desc: pick("首个水印偏移", "First watermark offset"),
  },
  {
    name: "font-size",
    type: "number",
    default: "16",
    desc: pick("旧版字号和颜色属性", "Legacy font size and color props"),
  },
  {
    name: "font-color",
    type: "string",
    default: "rgba(0,0,0,0.15)",
    desc: pick("旧版字号和颜色属性", "Legacy font size and color props"),
  },
  {
    name: "font",
    type: "{ color?, fontSize?, fontWeight?, fontStyle?, fontFamily?, textAlign? }",
    default: "{}",
    desc: pick(
      "字体对象，优先于 font-size 与 font-color",
      "Font object, preferred over font-size and font-color",
    ),
  },
  {
    name: "z-index",
    type: "number",
    default: "9",
    desc: pick("水印覆盖层层级", "Watermark overlay z-index"),
  },
  {
    name: "append-to",
    type: "string | HTMLElement",
    default: "null",
    desc: pick("将水印覆盖层挂载到指定容器", "Mount the watermark overlay in a target container"),
  },
  {
    name: "anti-tamper",
    type: "boolean",
    default: "false",
    desc: pick("覆盖层被删除或改写时自动恢复", "Restore the overlay after removal or mutation"),
  },
];

const PageWatermarkProps = defineHtml(`
  <elf-api-builder component="elf-watermark" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows} />
  <elf-props-table role="slots" title="Slots" :rows=${[{ name: "default", desc: pick("承载水印的内容", "Content covered by the watermark") }]} />
  <elf-props-table role="methods" title="Expose" :rows=${[{ name: "refresh()", desc: pick("立即重建并同步水印覆盖层", "Rebuild and synchronize the watermark overlay immediately") }]} />
  </elf-api-builder>
`);

export { PageWatermarkProps };
