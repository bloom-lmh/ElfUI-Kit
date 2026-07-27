/** @internal Documentation-site infrastructure; not part of the ElfUI public component API. */
export interface PlaygroundProps {
  title: string;
  code: string;
  script: string;
  ruler: boolean;
}

export type PlaygroundEmits = {
  copy: [code: string];
  copyError: [error: unknown];
};

export interface PlaygroundSlots {
  default?: unknown;
  status?: unknown;
  controls?: unknown;
}

export interface PlaygroundExpose {
  showTemplate: () => void;
  showScript: () => void;
  copy: () => Promise<boolean>;
}

export type PlaygroundElement = HTMLElement & PlaygroundProps & PlaygroundExpose;
