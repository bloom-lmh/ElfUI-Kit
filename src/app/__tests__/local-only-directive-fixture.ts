import { defineDirective, defineHtml } from "@elfui/core";

export const localOnlyCalls: string[] = [];

const localOnly = defineDirective({
  mounted: (element: HTMLElement) => localOnlyCalls.push(element.tagName.toLowerCase())
});

const TestLocalDirective = defineHtml(`<button v-local-only>x</button>`);

export { TestLocalDirective };
