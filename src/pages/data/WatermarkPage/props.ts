import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "content", type: "string | string[]", default: "''", desc: "水印文字；数组会按行显示" },
  { name: "image", type: "string", default: "''", desc: "水印图片地址，优先于文字" },
  { name: "width / height", type: "number", default: "120 / 64", desc: "单个水印平铺尺寸" },
  { name: "rotate", type: "number", default: "-22", desc: "水印旋转角度" },
  { name: "gap-x / gap-y", type: "number", default: "100 / 100", desc: "水印间距" },
  { name: "offset-x / offset-y", type: "number", default: "gap / 2", desc: "首个水印偏移" },
  { name: "font-size / font-color", type: "number / string", default: "16 / rgba(0,0,0,0.15)", desc: "旧版字号和颜色属性" },
  {
    name: "font",
    type: "{ color?, fontSize?, fontWeight?, fontStyle?, fontFamily?, textAlign? }",
    default: "{}",
    desc: "字体对象，优先于 font-size 与 font-color"
  },
  { name: "z-index", type: "number", default: "9", desc: "水印覆盖层层级" },
  { name: "append-to", type: "string | HTMLElement", default: "null", desc: "将水印覆盖层挂载到指定容器" },
  { name: "anti-tamper", type: "boolean", default: "false", desc: "覆盖层被删除或改写时自动恢复" }
];

const PageWatermarkProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${[{ name: "default", desc: "承载水印的内容" }]} />
  <elf-props-table title="Expose" :rows=${[{ name: "refresh()", desc: "立即重建并同步水印覆盖层" }]} />
`);

export { PageWatermarkProps };
