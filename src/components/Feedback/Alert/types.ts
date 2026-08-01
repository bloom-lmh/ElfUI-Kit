/** Semantic color applied to an Alert. */
export type AlertType = "info" | "tip" | "success" | "warning" | "danger";

/** Surface treatment applied without changing the Alert behavior. */
export type AlertVariant = "tonal" | "soft" | "elevated" | "outlined" | "plain" | "filled";

/** Vertical density of the Alert content. */
export type AlertDensity = "default" | "compact";

/** Public inputs accepted by `elf-alert`. */
export interface AlertProps {
  type: AlertType;
  variant: AlertVariant;
  title: string;
  description: string;
  closable: boolean;
  closeText: string;
  showIcon: boolean;
  center: boolean;
  density: AlertDensity;
  prominent: boolean;
}

/** Events emitted by `elf-alert`. */
export interface AlertEmits {
  close: [];
}

/** Content regions exposed by `elf-alert`. */
export interface AlertSlots {
  default?: () => unknown;
  title?: () => unknown;
  icon?: () => unknown;
}
