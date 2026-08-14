import utilityStyles from "./styles/utilities.scss?inline";

interface UtilityStyleInstallation {
  count: number;
  owned: boolean;
  style: HTMLStyleElement;
}

const installations = new WeakMap<Document | ShadowRoot, UtilityStyleInstallation>();
const utilityStyleSelector = 'style[data-elfui-utilities=""]';

const createDisposer = (
  target: Document | ShadowRoot,
  installation: UtilityStyleInstallation,
): (() => void) => {
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    installation.count -= 1;
    if (installation.count === 0) {
      if (installation.owned) installation.style.remove();
      installations.delete(target);
    }
  };
};

const resolveStyleContainer = (target: Document | ShadowRoot): ParentNode & Node =>
  target.nodeType === 9
    ? ((target as Document).head ?? (target as Document).documentElement)
    : target;

/**
 * Installs ElfUI's optional utility classes into a document or Shadow Root.
 * Component structural styles remain embedded in their own definitions.
 */
export const installUtilityStyles = (target?: Document | ShadowRoot): (() => void) => {
  const resolvedTarget =
    target ?? (typeof document === "undefined" ? undefined : (document as Document));
  if (!resolvedTarget) return () => undefined;

  const installed = installations.get(resolvedTarget);
  if (installed) {
    installed.count += 1;
    return createDisposer(resolvedTarget, installed);
  }

  const container = resolveStyleContainer(resolvedTarget);
  const existing = container.querySelector<HTMLStyleElement>(utilityStyleSelector);
  const style =
    existing ?? container.ownerDocument?.createElement("style") ?? document.createElement("style");
  const installation: UtilityStyleInstallation = {
    count: 1,
    owned: !existing,
    style,
  };

  if (!existing) {
    style.setAttribute("data-elfui-utilities", "");
    style.textContent = utilityStyles;
    container.appendChild(style);
  }
  installations.set(resolvedTarget, installation);

  return createDisposer(resolvedTarget, installation);
};
