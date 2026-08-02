import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "水平菜单", en: "Horizontal menu" },
  title: { zh: "顶部导航 / 下方面板", en: "Top navigation / submenu panel" },
  current: { zh: "当前选中", en: "Selected" },
});

const active = useRef("/product/list");

const items = [
  {
    index: "/product",
    label: "Product",
    icon: "📦",
    children: [
      { index: "/product/list", label: "Product list" },
      { index: "/product/category", label: "Categories" },
      { index: "/product/inventory", label: "Inventory" },
      { index: "/product/pricing", label: "Pricing" },
      { index: "/product/reviews", label: "Reviews" },
      { index: "/product/shipping", label: "Shipping" },
    ],
  },
  {
    index: "/order",
    label: "Order",
    icon: "📋",
    children: [
      { index: "/order/list", label: "Orders" },
      { index: "/order/refund", label: "Refunds" },
      { index: "/order/invoice", label: "Invoices" },
      { index: "/order/tracking", label: "Tracking" },
      { index: "/order/history", label: "History" },
    ],
  },
  { index: "/analytics", label: "Analytics", icon: "A" },
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const code = `<elf-menu
  mode="horizontal"
  :items.prop="items"
  :modelValue="active"
  @update:modelValue="onChange"
/>`;

const script = `const active = useRef("/product/list");

const items = [
  {
    index: "/product",
    label: "Product",
    icon: "📦",
    children: [
      { index: "/product/list", label: "Product list" },
      { index: "/product/category", label: "Categories" }
    ]
  },
  { index: "/analytics", label: "Analytics", icon: "A" }
];

const onChange = (event) => {
  active.set(event.detail);
};`;

const PageMenuEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("current")}: {{ active }}</span>
    <div style="width:100%;max-width:860px">
      <elf-menu
        bordered
        mode="horizontal"
        :items.prop=${items}
        :modelValue.prop=${active.value}
        @update:modelValue=${onChange}
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx2 };
