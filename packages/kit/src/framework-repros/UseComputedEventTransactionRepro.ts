import { defineExpose, defineHtml, useComputed, useRef } from "@elfui/core";

const source = useRef(1);
const observedInsideHandler = useRef(-1);
const doubled = useComputed(() => source.value * 2);

const onClick = (): void => {
  source.set(2);
  observedInsideHandler.set(doubled.value);
};

const resetRepro = (): void => {
  source.set(1);
  observedInsideHandler.set(-1);
  void doubled.value;
};

const readObservedInsideHandler = (): number => observedInsideHandler.value;
const readCurrentComputed = (): number => doubled.value;

defineExpose({
  resetRepro,
  readObservedInsideHandler,
  readCurrentComputed,
});

const UseComputedEventTransactionRepro = defineHtml(`
  <button type="button" @click=${onClick}>Run reproduction</button>
  <output>${observedInsideHandler}</output>
  <span>${doubled}</span>
`);

export { UseComputedEventTransactionRepro };
