/** @internal Documentation-site card used by the component overview page. */
export interface OverviewCardProps {
  title: string;
  href: string;
  badge: string;
  ariaLabel: string;
}

/** @internal Preview content rendered in the card's visual stage. */
export interface OverviewCardSlots {
  default?: () => unknown;
}
