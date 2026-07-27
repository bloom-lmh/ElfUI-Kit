import { defineHtml, defineStyle } from "@elfui/core";

import styles from "./style.scss?inline";
import type { SpacerProps } from "./types";

export type { SpacerProps } from "./types";

defineStyle(styles);

const Spacer = defineHtml<SpacerProps>(``);

export { Spacer };
