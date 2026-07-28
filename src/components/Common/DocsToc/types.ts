/** @internal Documentation-site infrastructure; not part of the ElfUI public API. */
export interface DocsTocProps {
  routeKey: string;
  label: string;
  target: string;
  minLevel: number;
  maxLevel: number;
}

export type DocsTocEmits = {
  navigate: [id: string];
};

export interface DocsTocExpose {
  refresh: () => void;
}

export type DocsTocElement = HTMLElement & DocsTocProps & DocsTocExpose;
