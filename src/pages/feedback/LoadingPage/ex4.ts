import { defineHtml } from "@elfui/core";

import type { LoadingVariant } from "../../../components/Feedback/Loading/types";

const code = `<elf-loading loading variant="spinner" text="同步数据中">...</elf-loading>
<elf-loading loading variant="dots" text="正在连接">...</elf-loading>
<elf-loading loading variant="pulse" text="等待响应">...</elf-loading>
<elf-loading loading variant="bars" text="分析数据">...</elf-loading>`;

interface VariantExample {
  value: LoadingVariant;
  label: string;
  text: string;
}

const variants: VariantExample[] = [
  { value: "spinner", label: "旋转", text: "同步数据中" },
  { value: "dots", label: "圆点", text: "正在连接" },
  { value: "pulse", label: "脉冲", text: "等待响应" },
  { value: "bars", label: "音柱", text: "分析数据" }
];

const variantKey = (item: VariantExample): LoadingVariant => item.value;
const variantLabel = (item: VariantExample): string => item.label;
const variantText = (item: VariantExample): string => item.text;

const PageLoadingEx4 = defineHtml(`
  <elf-playground title="四种加载动效" :code=${code}>
    <div
      style="display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:14px;width:100%;max-width:760px"
    >
      <article
        v-for="item in variants"
        :key="variantKey(item)"
        style="display:grid;gap:8px;min-height:150px"
      >
        <strong style="font-size:13px;color:var(--elf-text-secondary)">{{ variantLabel(item) }}</strong>
        <elf-loading loading :variant="variantKey(item)" :text="variantText(item)">
          <div
            style="height:118px;border:1px solid var(--elf-divider);border-radius:14px;background:var(--elf-bg-paper)"
          ></div>
        </elf-loading>
      </article>
    </div>
  </elf-playground>
`);

export { PageLoadingEx4 };
