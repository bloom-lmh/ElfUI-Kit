// Data 展示组件
import { registerComponents } from "@elfui/core";

import { Card } from "./Card/index";
import { Carousel } from "./Carousel/index";
import { CarouselItem } from "./CarouselItem/index";
import { Collapse } from "./Collapse/index";
import { CollapseItem } from "./CollapseItem/index";
import { Countdown } from "./Countdown/index";
import { Descriptions } from "./Descriptions/index";
import { DescriptionsItem } from "./DescriptionsItem/index";
import { Divider } from "./Divider/index";
import { Empty } from "./Empty/index";
import { Image } from "./Image/index";
import { InfiniteScroll } from "./InfiniteScroll/index";
import { List } from "./List/index";
import { ListItem } from "./ListItem/index";
import { Parallax } from "./Parallax/index";
import { Pagination } from "./Pagination/index";
import { Progress } from "./Progress/index";
import { Result } from "./Result/index";
import { Skeleton } from "./Skeleton/index";
import { Statistic } from "./Statistic/index";
import { Table } from "./Table/index";
import { TableV2 } from "./TableV2/index";
import { Timeline } from "./Timeline/index";
import { Transfer } from "./Transfer/index";
import { Tree } from "./Tree/index";
import { VirtualList } from "./VirtualList/index";
import { Watermark } from "./Watermark/index";

registerComponents(
  Card,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Countdown,
  Descriptions,
  DescriptionsItem,
  Divider,
  Empty,
  Image,
  InfiniteScroll,
  List,
  ListItem,
  Parallax,
  Pagination,
  Progress,
  Result,
  Skeleton,
  Statistic,
  Table,
  TableV2,
  Timeline,
  Transfer,
  Tree,
  VirtualList,
  Watermark
);

export { infiniteScrollDirective, registerInfiniteScrollDirective } from "./InfiniteScroll/directive";
export type {
  InfiniteScrollContainer,
  InfiniteScrollDirectiveHandler,
  InfiniteScrollDirectiveOptions,
  InfiniteScrollDirectiveValue,
  InfiniteScrollEmits,
  InfiniteScrollExposes,
  InfiniteScrollProps,
  InfiniteScrollSlots
} from "./InfiniteScroll/types";

export { List } from "./List/index";
export type {
  ListExposes,
  ListItemKey,
  ListItemRenderer,
  ListProps,
  ListSlots
} from "./List/types";
export { ListItem } from "./ListItem/index";
export type {
  ListItemEmits,
  ListItemExposes,
  ListItemProps,
  ListItemSlots
} from "./ListItem/types";
export { VirtualList } from "./VirtualList/index";
export type { VirtualListExpose, VirtualListProps } from "./VirtualList/types";
export { Parallax } from "./Parallax/index";
export type { ParallaxExpose, ParallaxProps } from "./Parallax/types";
export { computeVariableVirtualWindow, computeVirtualWindow } from "./virtual-window";
export type { VariableVirtualWindowOptions, VirtualWindow, VirtualWindowOptions } from "./virtual-window";
export { Table } from "./Table/index";
export type { TableProps, TableColumn, TableRow } from "./Table/types";
export { TableV2 } from "./TableV2/index";
export type {
  TableV2CellContext,
  TableV2Column,
  TableV2Element,
  TableV2Expose,
  TableV2HeaderContext,
  TableV2Props,
  TableV2RowHeight,
  TableV2RowsRenderedDetail,
  TableV2Slots,
  TableV2SortBy
} from "./TableV2/types";
