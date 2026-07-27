import { defineHtml, useRef } from "@elfui/core";

const revenue = useRef(18_640);
const orders = useRef(486);
const satisfaction = useRef(96.8);

const code = `<elf-statistic
  animated
  title="实时收入"
  :start-value="12000"
  :value.prop="revenue"
  :duration="1200"
  easing="ease-out"
  prefix="¥"
/>
<elf-button @click="grow">模拟下一批数据</elf-button>`;

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
  <h2>动态增长</h2>
  <elf-playground title="起始值、时长与缓动" :code=${code} :script=${script}>
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;width:100%;max-width:760px"
    >
      <elf-card variant="outlined">
        <elf-statistic
          animated
          title="实时收入"
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
          title="完成订单"
          :start-value=${320}
          :value.prop=${orders.value}
          :duration=${1600}
          easing="linear"
          suffix="单"
        ></elf-statistic>
      </elf-card>
      <elf-card variant="outlined">
        <elf-statistic
          animated
          title="满意度"
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
      <span>目标收入：¥{{ revenue }}</span>
      <elf-button size="small" type="primary" @click=${grow}>模拟下一批数据</elf-button>
    </span>
  </elf-playground>
`);

export { PageStatisticEx5 };
