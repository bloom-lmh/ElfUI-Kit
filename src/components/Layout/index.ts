// 布局组件统一注册入口

import { registerComponents } from "@elfui/core";

import { Aside } from "./Aside/index";
import { Container } from "./Container/index";
import { Flex } from "./Flex/index";
import { Footer } from "./Footer/index";
import { Grid } from "./Grid/index";
import { GridItem } from "./GridItem/index";
import { Header } from "./Header/index";
import { Layout } from "./Layout/index";
import { Main } from "./Main/index";
import { Masonry } from "./Masonry/index";
import { Scrollbar } from "./Scrollbar/index";
import { Splitter, SplitterPanel } from "./Splitter/index";
import { Space } from "./Space/index";
import { Spacer } from "./Spacer/index";
import { Sticky } from "./Sticky/index";

registerComponents(
  Container,
  Flex,
  Grid,
  GridItem,
  Layout,
  Header,
  Aside,
  Main,
  Footer,
  Space,
  Spacer,
  Masonry,
  Sticky,
  Scrollbar,
  Splitter,
  SplitterPanel
);

export { Masonry } from "./Masonry/index";
export type { MasonryGap, MasonryProps, MasonrySlots } from "./Masonry/types";
export { Space } from "./Space/index";
export type { SpaceAlignment, SpaceDirection, SpacePresetSize, SpaceProps, SpaceSize, SpaceSlots } from "./Space/types";
export { Spacer } from "./Spacer/index";
export type { SpacerProps } from "./Spacer/types";
