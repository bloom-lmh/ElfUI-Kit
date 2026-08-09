import { defineEmits, defineHtml, defineProps } from "@elfui/core";

import { useMessageBox } from "@elfui/kit";

const props = defineProps<{
  openLabel: string;
  title: string;
  message: string;
}>({
  openLabel: { type: String, default: "" },
  title: { type: String, default: "" },
  message: { type: String, default: "" },
});

const messageBox = useMessageBox();
const emit = defineEmits<{
  "status-change": [value: "confirmed" | "cancelled"];
}>();

const openConfigured = async (): Promise<void> => {
  try {
    await messageBox.confirm(props.message, props.title);
    emit("status-change", "confirmed");
  } catch {
    emit("status-change", "cancelled");
  }
};

const PageMessageBoxServicePreview = defineHtml(`
  <elf-button @click=${openConfigured}>${props.openLabel}</elf-button>
`);

export { PageMessageBoxServicePreview };
