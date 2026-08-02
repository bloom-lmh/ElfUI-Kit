// elf-layout 类型定义

/** 布局主轴方向
 * - vertical: 垂直排布（默认；header/main/footer 上下堆叠）
 * - horizontal: 水平排布（aside/main 左右）
 *
 * 可手动指定，也可让组件自动判断（默认 vertical；嵌套场景由父结构决定）
 */
export type LayoutDirection = "" | "vertical" | "horizontal";

export interface LayoutProps {
  direction: LayoutDirection;
}

export interface LayoutSlots {
  default?: unknown;
}
