import { globalStyle, onMounted } from "@elfui/core";

interface GlobalStyleRecord {
  consumers: number;
  css: string;
  dispose: () => void;
}

const stylesByDocument = new WeakMap<Document, Map<string, GlobalStyleRecord>>();

/**
 * Installs document-level styles only while at least one component instance is mounted.
 * Keeping DOM access inside the lifecycle hook makes component modules safe to import in SSR.
 */
export const useGlobalStyle = (id: string, css: string): void => {
  onMounted(() => {
    if (typeof document === "undefined") return;

    let styles = stylesByDocument.get(document);
    if (!styles) {
      styles = new Map();
      stylesByDocument.set(document, styles);
    }

    let record = styles.get(id);
    if (!record) {
      record = {
        consumers: 0,
        css,
        dispose: globalStyle(css, { id }),
      };
      styles.set(id, record);
    } else if (record.css !== css) {
      record.dispose();
      record.css = css;
      record.dispose = globalStyle(css, { id });
    }

    record.consumers += 1;

    return () => {
      const current = styles.get(id);
      if (!current) return;

      current.consumers -= 1;
      if (current.consumers > 0) return;

      current.dispose();
      styles.delete(id);
      if (styles.size === 0) stylesByDocument.delete(document);
    };
  });
};
