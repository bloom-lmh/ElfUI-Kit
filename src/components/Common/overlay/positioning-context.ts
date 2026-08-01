interface TargetPositionState {
  count: number;
  inlinePosition: string;
}

const targetPositionStates = new WeakMap<HTMLElement, TargetPositionState>();

export type TargetPositionLease = () => void;

/**
 * Acquires a relative positioning context without overwriting another overlay owner's lease.
 *
 * @param target - Element that contains one or more absolutely positioned overlays.
 * @returns An idempotent release function when the target needed shared patching, otherwise `null`.
 */
export const acquireTargetPositionContext = (target: HTMLElement): TargetPositionLease | null => {
  const current = targetPositionStates.get(target);
  if (current) current.count += 1;
  else {
    if (getComputedStyle(target).position !== "static") return null;
    targetPositionStates.set(target, { count: 1, inlinePosition: target.style.position });
    target.style.position = "relative";
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    const state = targetPositionStates.get(target);
    if (!state) return;
    state.count -= 1;
    if (state.count > 0) return;
    if (target.style.position === "relative") target.style.position = state.inlinePosition;
    targetPositionStates.delete(target);
  };
};
