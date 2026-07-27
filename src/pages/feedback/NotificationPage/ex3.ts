import { defineHtml } from "@elfui/core";
import { ElfNotification } from "../../../components/Feedback";

const showLong = (): void => {
  ElfNotification({ title: "Long-lived", message: "This notification stays visible for ten seconds.", duration: 10000 });
};

const showPersistent = (): void => {
  ElfNotification({ title: "Persistent", message: "This one only closes through the service handle or closeAll.", duration: 0 });
};

const showCustomized = (): void => {
  ElfNotification({
    title: "Custom service options",
    message: "Custom class, z-index, offset, close glyph, and callback are applied together.",
    type: "success",
    duration: 0,
    offset: 48,
    zIndex: 3100,
    customClass: "notification-demo-custom",
    closeIcon: "Close",
    onClose: () => console.info("Notification closed")
  });
};

const handleCloseAll = (): void => ElfNotification.closeAll();

const code3 = `ElfNotification({ title: "...", message: "...", duration: 10000 })
ElfNotification({ title: "...", message: "...", duration: 0 })
ElfNotification({
  title: "Custom service options",
  message: "...",
  customClass: "notification-demo-custom",
  zIndex: 3100,
  offset: 48,
  closeIcon: "Close",
  onClose: () => console.info("Notification closed")
})
ElfNotification.closeAll()`;

const PageNotificationEx3 = defineHtml(`
  <h2>Duration and service options</h2>
  <elf-playground title="Duration, stacking offset, z-index, and close lifecycle" :code=${code3}>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click=${showLong}>Show 10 seconds</elf-button>
      <elf-button @click=${showPersistent}>Keep open</elf-button>
      <elf-button @click=${showCustomized}>Custom options</elf-button>
      <elf-button color="danger" @click=${handleCloseAll}>Close all</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx3 };
