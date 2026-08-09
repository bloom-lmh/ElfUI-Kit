import type { CascaderOption } from "@elfui/kit";

export type DocsPick = (zh: string, en: string) => string;

export const createRegionOptions = (pick: DocsPick): CascaderOption[] => [
  {
    label: pick("浙江", "Zhejiang"),
    value: "zhejiang",
    children: [
      { label: pick("杭州", "Hangzhou"), value: "hangzhou" },
      { label: pick("宁波", "Ningbo"), value: "ningbo" },
    ],
  },
  {
    label: pick("江苏", "Jiangsu"),
    value: "jiangsu",
    children: [
      { label: pick("南京", "Nanjing"), value: "nanjing" },
      { label: pick("苏州", "Suzhou"), value: "suzhou" },
    ],
  },
  {
    label: pick("广东", "Guangdong"),
    value: "guangdong",
    children: [
      { label: pick("广州", "Guangzhou"), value: "guangzhou" },
      { label: pick("深圳", "Shenzhen"), value: "shenzhen", disabled: true },
    ],
  },
];

export const regionOptionsScript = `const options = [
  {
    label: "Zhejiang",
    value: "zhejiang",
    children: [
      { label: "Hangzhou", value: "hangzhou" },
      { label: "Ningbo", value: "ningbo" }
    ]
  },
  {
    label: "Jiangsu",
    value: "jiangsu",
    children: [
      { label: "Nanjing", value: "nanjing" },
      { label: "Suzhou", value: "suzhou" }
    ]
  },
  {
    label: "Guangdong",
    value: "guangdong",
    children: [
      { label: "Guangzhou", value: "guangzhou" },
      { label: "Shenzhen", value: "shenzhen", disabled: true }
    ]
  }
];`;

export const formatPaths = (paths: unknown, empty: string): string => {
  if (!Array.isArray(paths) || paths.length === 0) return empty;
  return Array.isArray(paths[0])
    ? (paths as string[][]).map((path) => path.join(" / ")).join(", ") || empty
    : (paths as string[]).join(" / ") || empty;
};
