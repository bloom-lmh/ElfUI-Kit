// cspell:ignore markdownit
// The three markdown-it plugins ship without type declarations.
// @ts-expect-error package ships no type declarations
import containerImpl from "markdown-it-container";
// @ts-expect-error package ships no type declarations
import footnoteImpl from "markdown-it-footnote";
// @ts-expect-error package ships no type declarations
import taskListsImpl from "markdown-it-task-lists";

import type MarkdownIt from "markdown-it";

export interface ContainerToken {
  type: string;
  nesting: number;
  info: string;
  content: string;
}

export interface ContainerOptions {
  validate?: (params: string) => boolean;
  render?: (
    tokens: ContainerToken[],
    index: number,
    options: unknown,
    env: unknown,
    self: unknown,
  ) => string;
}

export interface TaskListOptions {
  enabled?: boolean;
  label?: boolean;
  labelAfter?: boolean;
}

export const container = containerImpl as unknown as (
  md: MarkdownIt,
  name: string,
  options?: ContainerOptions,
) => void;

export const footnote = footnoteImpl as unknown as (md: MarkdownIt) => void;

export const taskLists = taskListsImpl as unknown as (
  md: MarkdownIt,
  options?: TaskListOptions,
) => void;
