import { defineExpose, defineHtml, useRef, useScrollLock } from "@elfui/core";

const firstOwner = useRef(false);
const secondOwner = useRef(false);

useScrollLock(() => firstOwner.value);
useScrollLock(() => secondOwner.value);

const resetRepro = (): void => {
  firstOwner.set(false);
  secondOwner.set(false);
};

defineExpose({
  resetRepro,
  setFirstOwner: (locked: boolean) => firstOwner.set(locked),
  setSecondOwner: (locked: boolean) => secondOwner.set(locked),
});

const UseScrollLockConcurrentOwnersRepro = defineHtml(`
  <span>Concurrent scroll lock reproduction</span>
`);

export { UseScrollLockConcurrentOwnersRepro };
