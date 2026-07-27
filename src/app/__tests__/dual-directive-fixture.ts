import { defineDirective, defineHtml } from "@elfui/core";

export const localDualCalls: string[] = [];

const dual = defineDirective({
  mounted: () => localDualCalls.push("local")
});

const TestDualDirective = defineHtml(`<button v-dual>x</button>`);

export { TestDualDirective };
