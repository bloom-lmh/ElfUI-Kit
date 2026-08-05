import type { MdPageTocEntry } from "../MdPage/types";

export interface MdOutlineProps {
  /** Id of the target `elf-md-page` element. */
  target: string;
  /** Direct outline data; takes precedence over the target lookup. */
  toc: MdPageTocEntry[];
  /** Only render entries up to this depth. */
  maxDepth: number;
  /** Accessible label for the navigation. */
  label: string;
  /** Muted text shown when the outline has no entries. */
  emptyText: string;
}

export interface MdOutlineEmits {
  select: [id: string];
}

export interface MdOutlineExpose {
  /** Scrolls the target heading into view; returns whether it was found. */
  scrollTo(id: string): boolean;
  /** Returns the heading id currently active in the target's scroll spy. */
  active(): string;
}

export type MdOutlineSlots = object;

export type MdOutlineElement = HTMLElement & MdOutlineExpose;
