// Navigation components
import { registerComponents } from "@elfui/core";

import { Anchor } from "./Anchor/index";
import { AnchorLink } from "./AnchorLink/index";
import { AppBar } from "./AppBar/index";
import { BackTop } from "./BackTop/index";
import { BottomNavigation } from "./BottomNavigation/index";
import { Breadcrumb } from "./Breadcrumb/index";
import { BreadcrumbItem } from "./BreadcrumbItem/index";
import { Dropdown } from "./Dropdown/index";
import { DropdownItem } from "./DropdownItem/index";
import { DropdownMenu } from "./DropdownMenu/index";
import { Menu } from "./Menu/index";
import { MenuItem } from "./MenuItem/index";
import { MenuItemGroup } from "./MenuItemGroup/index";
import { PageHeader } from "./PageHeader/index";
import { Step } from "./Step/index";
import { Steps } from "./Steps/index";
import { TabPane } from "./TabPane/index";
import { Tabs } from "./Tabs/index";
import { SubMenu } from "./SubMenu/index";

registerComponents(
  AppBar,
  BottomNavigation,
  Anchor,
  AnchorLink,
  BackTop,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  MenuItem,
  MenuItemGroup,
  SubMenu,
  Steps,
  Step,
  Tabs,
  TabPane,
  PageHeader,
);

export { AppBar } from "./AppBar/index";
export type {
  AppBarDensity,
  AppBarEmits,
  AppBarProps,
  AppBarScrollBehavior,
  AppBarSlots,
} from "./AppBar/types";
export { BottomNavigation } from "./BottomNavigation/index";
export type {
  BottomNavigationEmits,
  BottomNavigationItem,
  BottomNavigationProps,
  BottomNavigationSlots,
  BottomNavigationValue,
} from "./BottomNavigation/types";

export type {
  AnchorChangeDetail,
  AnchorClickDetail,
  AnchorElement,
  AnchorFieldNames,
  AnchorItem,
  AnchorLinkProps,
  AnchorLinkSlots,
  AnchorProps,
  AnchorSlots,
} from "./Anchor/types";
export type { BackTopElement, BackTopProps, BackTopShape } from "./BackTop/types";
export type {
  BreadcrumbFieldNames,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbItemSlots,
  BreadcrumbProps,
  BreadcrumbRouteLocation,
  BreadcrumbSlots,
} from "./Breadcrumb/types";
export type {
  DropdownButtonProps,
  DropdownButtonType,
  DropdownCommandDetail,
  DropdownCommand,
  DropdownEffect,
  DropdownElement,
  DropdownEmits,
  DropdownExpose,
  DropdownFieldNames,
  DropdownItem,
  DropdownItemProps,
  DropdownItemSlots,
  DropdownMenuProps,
  DropdownMenuSlots,
  DropdownPlacement,
  DropdownPopperModifier,
  DropdownPopperOptions,
  DropdownProps,
  DropdownSize,
  DropdownSlots,
  DropdownTrigger,
  DropdownTriggerMode,
  DropdownVirtualRef,
} from "./Dropdown/types";
export type {
  MenuExpose,
  MenuFieldNames,
  MenuItem,
  MenuItemClickDetail,
  MenuItemGroupProps,
  MenuItemGroupSlots,
  MenuItemProps,
  MenuItemSlots,
  MenuMode,
  MenuPopperStyle,
  MenuProps,
  MenuSlots,
  MenuTheme,
  MenuTogglePlacement,
  MenuTrigger,
  SubMenuProps,
  SubMenuSlots,
} from "./Menu/types";
export type {
  StepProps,
  StepSlots,
  StepItem,
  StepsChangeDetail,
  StepsDirection,
  StepsProps,
  StepsSize,
  StepStatus,
  StepsExpose,
  StepsSlots,
} from "./Steps/types";
export type {
  TabPaneName,
  TabPaneProps,
  TabPaneSlots,
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsExpose,
  TabsFieldNames,
  TabsItem,
  TabsPaneContext,
  TabsPosition,
  TabsProps,
  TabsSlots,
  TabsTransition,
  TabsType,
} from "./Tabs/types";
