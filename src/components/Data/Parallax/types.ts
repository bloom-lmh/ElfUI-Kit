export interface ParallaxProps {
  src: string;
  alt: string;
  height: number | string;
  scale: number;
  disabled: boolean;
  position: string;
}

export interface ParallaxExpose {
  update: () => void;
}
