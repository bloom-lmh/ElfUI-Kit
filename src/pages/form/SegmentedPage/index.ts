import { defineHtml, useComponents } from "@elfui/core";
import { PageSegmentedProps } from "./props";
import { PageSegmentedEx1 } from "./ex1";
import { PageSegmentedEx2 } from "./ex2";

useComponents({
  "page-segmented-ex1": PageSegmentedEx1,
  "page-segmented-ex2": PageSegmentedEx2,
  "page-segmented-props": PageSegmentedProps
});

const PageSegmented = defineHtml(`
    <elf-container>
        <h1>Segmented 分段控制器</h1>
        <p>在少量互斥选项中切换状态，支持受控值、禁用项、尺寸、block 布局及键盘导航。</p>
        <page-segmented-ex1 />
        <page-segmented-ex2 />
        <p>聚焦任一选项后，使用 ←/↑、→/↓、Home 和 End 在可用项之间切换。</p>
        <page-segmented-props></page-segmented-props>
    </elf-container>
`);

export { PageSegmented };
