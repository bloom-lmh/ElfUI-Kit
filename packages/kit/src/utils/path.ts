// 表单字段路径读写
//
// 支持点路径：`user.name` / `addresses.0.city`
// 没有路径深度限制，但出于安全和性能不支持任意 JS 表达式

const splitPath = (path: string): string[] =>
  path
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s !== "");

export const getPath = (obj: Record<string, unknown>, path: string): unknown => {
  const segs = splitPath(path);
  let cur: unknown = obj;
  for (const seg of segs) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
};

export const setPath = (obj: Record<string, unknown>, path: string, value: unknown): void => {
  const segs = splitPath(path);
  if (segs.length === 0) return;
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i] as string;
    if (cur[seg] == null || typeof cur[seg] !== "object") {
      cur[seg] = {};
    }
    cur = cur[seg] as Record<string, unknown>;
  }
  cur[segs[segs.length - 1] as string] = value;
};
