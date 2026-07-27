import { defineHtml, useComponents } from "@elfui/core";
import { PageTableEx1 } from "./ex1";
import { PageTableEx10 } from "./ex10";
import { PageTableEx11 } from "./ex11";
import { PageTableEx12 } from "./ex12";
import { PageTableEx13 } from "./ex13";
import { PageTableEx14 } from "./ex14";
import { PageTableEx15 } from "./ex15";
import { PageTableEx16 } from "./ex16";
import { PageTableEx17 } from "./ex17";
import { PageTableEx18 } from "./ex18";
import { PageTableEx19 } from "./ex19";
import { PageTableEx20 } from "./ex20";
import { PageTableEx21 } from "./ex21";
import { PageTableEx22 } from "./ex22";
import { PageTableEx23 } from "./ex23";
import { PageTableEx24 } from "./ex24";
import { PageTableEx2 } from "./ex2";
import { PageTableEx3 } from "./ex3";
import { PageTableEx4 } from "./ex4";
import { PageTableEx5 } from "./ex5";
import { PageTableEx6 } from "./ex6";
import { PageTableEx7 } from "./ex7";
import { PageTableEx8 } from "./ex8";
import { PageTableEx9 } from "./ex9";
import { PageTableProps } from "./props";

useComponents({
  "page-table-ex1": PageTableEx1,
  "page-table-ex10": PageTableEx10,
  "page-table-ex11": PageTableEx11,
  "page-table-ex12": PageTableEx12,
  "page-table-ex13": PageTableEx13,
  "page-table-ex14": PageTableEx14,
  "page-table-ex15": PageTableEx15,
  "page-table-ex16": PageTableEx16,
  "page-table-ex17": PageTableEx17,
  "page-table-ex18": PageTableEx18,
  "page-table-ex19": PageTableEx19,
  "page-table-ex20": PageTableEx20,
  "page-table-ex21": PageTableEx21,
  "page-table-ex22": PageTableEx22,
  "page-table-ex23": PageTableEx23,
  "page-table-ex24": PageTableEx24,
  "page-table-ex2": PageTableEx2,
  "page-table-ex3": PageTableEx3,
  "page-table-ex4": PageTableEx4,
  "page-table-ex5": PageTableEx5,
  "page-table-ex6": PageTableEx6,
  "page-table-ex7": PageTableEx7,
  "page-table-ex8": PageTableEx8,
  "page-table-ex9": PageTableEx9,
  "page-table-props": PageTableProps
});

const PageTable = defineHtml(`
  <elf-container>
    <h1>Table 表格</h1>
    <p>用于结构化数据展示，支持排序、选择、当前行、高度滚动和分页联动。</p>
    <page-table-ex1></page-table-ex1>
    <page-table-ex2></page-table-ex2>
    <page-table-ex3></page-table-ex3>
    <page-table-ex4></page-table-ex4>
    <page-table-ex5></page-table-ex5>
    <page-table-ex6></page-table-ex6>
    <page-table-ex7></page-table-ex7>
    <page-table-ex8></page-table-ex8>
    <page-table-ex9></page-table-ex9>
    <page-table-ex10></page-table-ex10>
    <page-table-ex11></page-table-ex11>
    <page-table-ex12></page-table-ex12>
    <page-table-ex13></page-table-ex13>
    <page-table-ex14></page-table-ex14>
    <page-table-ex15></page-table-ex15>
    <page-table-ex16></page-table-ex16>
    <page-table-ex17></page-table-ex17>
    <page-table-ex18></page-table-ex18>
    <page-table-ex19></page-table-ex19>
    <page-table-ex20></page-table-ex20>
    <page-table-ex21></page-table-ex21>
    <page-table-ex22></page-table-ex22>
    <page-table-ex23></page-table-ex23>
    <page-table-ex24></page-table-ex24>
    <page-table-props></page-table-props>
  </elf-container>
`);

export { PageTable };
