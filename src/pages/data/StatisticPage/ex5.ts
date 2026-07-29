import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "动态增长", en: "Animated growth" },
  playground: { zh: "起始值、时长与缓动", en: "Start value, duration, and easing" },
  revenue: { zh: "实时收入", en: "Live revenue" },
  orders: { zh: "完成订单", en: "Completed orders" },
  ordersSuffix: { zh: "单", en: " orders" },
  satisfaction: { zh: "满意度", en: "Satisfaction" },
  target: { zh: "目标收入", en: "Target revenue" },
  grow: { zh: "模拟下一批数据", en: "Simulate next batch" }
});
const revenue = useRef(18_640);
const orders = useRef(486);
const satisfaction = useRef(96.8);

const code = `<elf-statistic
  animated
  title="${t("revenue")}"
  :start-value="12000"
  :value.prop="revenue"
  :duration="1200"
  easing="ease-out"
  prefix="¥"
/>
<elf-button @click="grow">${t("grow")}</elf-button>`;

const script = `const revenue = useRef(18640);

const grow = () => {
  revenue.set(revenue.value + 1280);
};`;

const grow = (): void => {
  revenue.set(revenue.peek() + 1280);
  orders.set(orders.peek() + 24);
  satisfaction.set(Math.min(99.9, satisfaction.peek() + 0.4));
};

const PageStatisticEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;width:100%;max-width:760px"
    >
      <elf-card variant="outlined">
        <elf-statistic
          animated
          title=${t("revenue")}
          :start-value=${12000}
          :value.prop=${revenue.value}
          :duration=${1200}
          easing="ease-out"
          prefix="¥"
        ></elf-statistic>
      </elf-card>
      <elf-card variant="outlined">
        <elf-statistic
          animated
          title=${t("orders")}
          :start-value=${320}
          :value.prop=${orders.value}
          :duration=${1600}
          easing="linear"
          suffix=${t("ordersSuffix")}
        ></elf-statistic>
      </elf-card>
      <elf-card variant="outlined">
        <elf-statistic
          animated
          title=${t("satisfaction")}
          :start-value=${80}
          :value.prop=${satisfaction.value}
          :precision=${1}
          :duration=${1400}
          easing="ease-in-out"
          suffix="%"
        ></elf-statistic>
      </elf-card>
    </div>
    <span slot="status" style="display:flex;align-items:center;gap:10px">
      <span>${t("target")}：¥{{ revenue }}</span>
      <elf-button size="small" type="primary" @click=${grow}>${t("grow")}</elf-button>
    </span>
  </elf-playground>
`);

export { PageStatisticEx5 };
