/** @internal Documentation-site page hero; not part of the public component API. */
export interface DocsHeroProps {
  category: string;
  title: string;
  description: string;
  tag: string;
  version: string;
}

export interface DocsHeroSlots {
  meta?: () => unknown;
  extra?: () => unknown;
}
