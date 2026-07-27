import { defineHtml, useComponents } from "@elfui/core";
import { PageStatisticProps } from "./props";
import { PageStatisticEx1 } from "./ex1";
import { PageStatisticEx2 } from "./ex2";
import { PageStatisticEx3 } from "./ex3";
import { PageStatisticEx4 } from "./ex4";
import { PageStatisticEx5 } from "./ex5";

useComponents({
  "page-statistic-ex1": PageStatisticEx1,
  "page-statistic-ex2": PageStatisticEx2,
  "page-statistic-ex3": PageStatisticEx3,
  "page-statistic-ex4": PageStatisticEx4,
  "page-statistic-ex5": PageStatisticEx5,
  "page-statistic-props": PageStatisticProps
});

const PageStatistic = defineHtml(`
  <elf-container>
    <h1>Statistic 统计数值</h1>
    <p>突出展示关键数字，并提供独立倒计时组件处理目标时间、格式化和结束通知。</p>
    <page-statistic-ex1 />
    <page-statistic-ex2 />
    <page-statistic-ex3 />
    <page-statistic-ex5 />
    <page-statistic-ex4 />
    <page-statistic-props></page-statistic-props>
  </elf-container>
`);

export { PageStatistic };
