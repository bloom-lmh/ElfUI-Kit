// elf-card 类型定义

export type CardVariant = "elevated" | "outlined" | "filled" | "tonal" | "flat";
export type CardShadow = "always" | "hover" | "never";
export type CardDensity = "default" | "comfortable" | "compact";
export type CardImagePlacement = "top" | "left";
export type CardBodyStyle = Record<string, string | number>;

export interface CardProps {
  /** Element Plus-compatible header text. The `header` slot takes precedence. */
  header: string;
  /** Element Plus-compatible footer text. The `footer` slot takes precedence. */
  footer: string;
  /** Inline styles for the card body. */
  bodyStyle: CardBodyStyle;
  headerClass: string;
  bodyClass: string;
  footerClass: string;
  /** When the card shadow is visible. */
  shadow: CardShadow;
  /** MD3 变体：elevated(阴影) | outlined(边框) | filled(填充背景) */
  variant: CardVariant;
  /** Vuetify 风格内容密度。 */
  density: CardDensity;
  /** 头像/图标地址 */
  avatar: string;
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 图片地址（快捷封面） */
  image: string;
  /** 快捷封面图片替代文本；装饰图可留空。 */
  imageAlt: string;
  /** 图片位置：top | left（水平布局） */
  imagePlacement: CardImagePlacement;
  /** 图片高度（top 模式），默认 200px */
  imageHeight: string;
  /** 图片宽度（left 模式），默认 40% */
  imageWidth: string;
  /** 图片上叠加文字 */
  overlay: string;
  /** 是否可点击，hover 时升阴影 + 光标变手 */
  clickable: boolean;
  /** 禁用整卡交互。 */
  disabled: boolean;
  /** 显示加载进度并暂时锁定整卡交互。 */
  loading: boolean;
}

export interface CardEmits {
  click: [];
  "image-load": [event: Event];
  "image-error": [event: Event];
}

export interface CardSlots {
  default?: unknown;
  cover?: unknown;
  title?: unknown;
  extra?: unknown;
  header?: unknown;
  footer?: unknown;
  loading?: unknown;
  "image-error"?: unknown;
}
