import {
  defineHtml,
  defineStyle,
  onMounted,
  useComputed,
  useEffect,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import type { ThemeTokens } from "../../components/Providers/context";
import {
  MATERIAL_COLOR_PALETTES,
  MATERIAL_COLOR_TONES,
  getMaterialColorPalette,
  type MaterialColorFamily,
  type MaterialColorTone,
} from "../../components/Providers/ThemeProvider/material-colors";
import { THEME_PRESETS, getThemePreset } from "../../components/Providers/ThemeProvider/presets";
import { createDocsPicker, createDocsTranslator } from "../docsLocale";
import {
  THEME_COLOR_FIELDS,
  contrastRatio,
  createThemeExport,
  derivePrimaryTokens,
  type ThemeExportFormat,
} from "./model";
import styles from "./style.scss?inline";

const DRAFT_KEY = "elfui-theme-studio-draft-v1";
const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "主题调色板", en: "Theme palette" },
  eyebrow: { zh: "ElfUI 主题工作台", en: "ElfUI theme studio" },
  description: {
    zh: "从品牌色到页面层级，实时调整语义 Token，并导出可直接接入 ConfigProvider 的主题配置。",
    en: "Tune semantic tokens from brand color to surfaces, preview real components, and export a ConfigProvider-ready theme.",
  },
  presets: { zh: "内置配色", en: "Built-in palettes" },
  editor: { zh: "Token 编辑器", en: "Token editor" },
  preview: { zh: "实时预览", en: "Live preview" },
  basic: { zh: "基础", en: "Basic" },
  advanced: { zh: "高级", en: "Advanced" },
  export: { zh: "导出配置", en: "Export theme" },
});

const initialPreset = getThemePreset("material");
const selectedPreset = useRef(initialPreset.id);
const tokens = useRef<ThemeTokens>({ ...initialPreset.tokens });
const schemeName = useRef("elfui-blue");
const editorMode = useRef<"basic" | "advanced">("basic");
const mobileView = useRef<"editor" | "preview">("editor");
const exportFormat = useRef<ThemeExportFormat>("config");
const materialQuery = useRef("");
const selectedMaterialFamily = useRef("blue");
const paletteTarget = useRef<PaletteTarget>("primary");
const status = useRef("");
const importFile = useTemplateRef<HTMLInputElement>("importFile");

type PaletteTarget = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

interface MaterialToneEntry {
  tone: MaterialColorTone;
  color: string;
}

const PALETTE_TARGETS: readonly PaletteTarget[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
];

const TONE_LABELS: Record<MaterialColorTone, string> = {
  lighten5: "50",
  lighten4: "100",
  lighten3: "200",
  lighten2: "300",
  lighten1: "400",
  base: "500",
  darken1: "600",
  darken2: "700",
  darken3: "800",
  darken4: "900",
  accent1: "A100",
  accent2: "A200",
  accent3: "A400",
  accent4: "A700",
};

const currentPreset = () => getThemePreset(selectedPreset.value);
const isDark = (): boolean => currentPreset().dark;
const editorFields = useComputed(() =>
  editorMode.value === "basic"
    ? THEME_COLOR_FIELDS.filter((field) => field.basic)
    : THEME_COLOR_FIELDS,
);
const primaryContrast = useComputed(() =>
  contrastRatio(
    String(tokens.value.textOnPrimary || "#FFFFFF"),
    String(tokens.value.primary || "#000000"),
  ),
);
const surfaceContrast = useComputed(() =>
  contrastRatio(
    String(tokens.value.textPrimary || "#000000"),
    String(tokens.value.bgPaper || "#FFFFFF"),
  ),
);
const exportCode = useComputed(() =>
  createThemeExport(exportFormat.value, schemeName.value || "elfui-custom", isDark(), tokens.value),
);
const filteredMaterialPalettes = useComputed(() => {
  const query = materialQuery.value.trim().toLowerCase();
  if (!query) return MATERIAL_COLOR_PALETTES;
  return MATERIAL_COLOR_PALETTES.filter((palette) =>
    [palette.id, palette.label, palette.labelZh].some((value) =>
      value.toLowerCase().includes(query),
    ),
  );
});
const activeMaterialPalette = useComputed(() =>
  getMaterialColorPalette(selectedMaterialFamily.value),
);
const activeMaterialTones = useComputed<readonly MaterialToneEntry[]>(() =>
  MATERIAL_COLOR_TONES.flatMap((tone) => {
    const color = activeMaterialPalette.value.colors[tone];
    return color ? [{ tone, color }] : [];
  }),
);

const previewColumns = [
  { prop: "component", label: pick("组件", "Component"), minWidth: 96 },
  { prop: "status", label: pick("状态", "Status"), minWidth: 80 },
  { prop: "owner", label: pick("负责人", "Owner"), minWidth: 84 },
];
const previewRows = [
  { id: 1, component: "Button", status: pick("已发布", "Released"), owner: "Mina" },
  { id: 2, component: "Table", status: pick("审核中", "Review"), owner: "Alex" },
  { id: 3, component: "Alert", status: pick("草稿", "Draft"), owner: "River" },
];

const presetLabel = (preset: (typeof THEME_PRESETS)[number]): string =>
  pick(preset.labelZh, preset.label);
const materialFamilyLabel = (palette: MaterialColorFamily): string =>
  pick(palette.labelZh, palette.label);
const paletteTargetLabel = (target: PaletteTarget): string => {
  const labels: Record<PaletteTarget, [string, string]> = {
    primary: ["主色", "Primary"],
    secondary: ["辅助色", "Secondary"],
    success: ["成功", "Success"],
    warning: ["警告", "Warning"],
    danger: ["危险", "Danger"],
    info: ["信息", "Info"],
  };
  return pick(...labels[target]);
};
const palettePreviewColors = (palette: MaterialColorFamily): string[] =>
  ["lighten4", "lighten2", "base", "darken2", "darken4"].flatMap((tone) => {
    const color = palette.colors[tone as MaterialColorTone];
    return color ? [color] : [];
  });
const swatchTextColor = (color: string): string =>
  contrastRatio("#FFFFFF", color) >= contrastRatio("#111827", color) ? "#FFFFFF" : "#111827";
const materialToneAriaLabel = (entry: MaterialToneEntry): string =>
  `${materialFamilyLabel(activeMaterialPalette.value)} ${TONE_LABELS[entry.tone]} ${entry.color}`;
const tokenValue = (key: keyof ThemeTokens): string => String(tokens.value[key] || "#000000");
const selectPreset = (event: Event): void => {
  const id = (event.currentTarget as HTMLElement).dataset.preset || "material";
  const preset = getThemePreset(id);
  selectedPreset.set(preset.id);
  tokens.set({ ...preset.tokens });
  schemeName.set(`elfui-${preset.id}`);
  status.set(pick(`已载入${preset.labelZh}方案`, `${preset.label} loaded`));
};
const setEditorMode = (event: Event): void =>
  editorMode.set(
    (event.currentTarget as HTMLElement).dataset.mode === "advanced" ? "advanced" : "basic",
  );
const setMobileView = (event: Event): void =>
  mobileView.set(
    (event.currentTarget as HTMLElement).dataset.view === "preview" ? "preview" : "editor",
  );
const updateMaterialQuery = (event: Event): void =>
  materialQuery.set((event.target as HTMLInputElement).value);
const selectMaterialFamily = (event: Event): void => {
  const family = (event.currentTarget as HTMLElement).dataset.family;
  if (family) selectedMaterialFamily.set(getMaterialColorPalette(family).id);
};
const selectPaletteTarget = (event: Event): void => {
  const target = (event.currentTarget as HTMLElement).dataset.target as PaletteTarget;
  if (PALETTE_TARGETS.includes(target)) paletteTarget.set(target);
};
const applyMaterialTone = (event: Event): void => {
  const color = (event.currentTarget as HTMLElement).dataset.color;
  if (!color) return;
  const target = paletteTarget.value;
  tokens.set({
    ...tokens.value,
    ...(target === "primary" ? derivePrimaryTokens(color, isDark()) : { [target]: color }),
  });
  status.set(
    pick(
      `${materialFamilyLabel(activeMaterialPalette.value)} ${TONE_LABELS[(event.currentTarget as HTMLElement).dataset.tone as MaterialColorTone]} 已应用到${paletteTargetLabel(target)}`,
      `${activeMaterialPalette.value.label} ${TONE_LABELS[(event.currentTarget as HTMLElement).dataset.tone as MaterialColorTone]} applied to ${paletteTargetLabel(target)}`,
    ),
  );
};
const updateName = (event: Event): void => schemeName.set((event.target as HTMLInputElement).value);
const updateToken = (event: CustomEvent<string>): void => {
  const key = (event.currentTarget as HTMLElement).dataset.token as keyof ThemeTokens;
  const value = String(event.detail || "");
  if (!key || !value) return;
  tokens.set({
    ...tokens.value,
    ...(key === "primary" ? derivePrimaryTokens(value, isDark()) : { [key]: value }),
  });
  selectedPreset.set(currentPreset().id);
  status.set(pick("自定义修改已保存为草稿", "Custom changes saved as a draft"));
};
const resetTheme = (): void => {
  const preset = currentPreset();
  tokens.set({ ...preset.tokens });
  status.set(pick("已恢复当前预设", "Preset restored"));
};
const setExportFormat = (event: Event): void => {
  exportFormat.set(
    ((event.currentTarget as HTMLElement).dataset.format || "config") as ThemeExportFormat,
  );
};
const copyExport = async (): Promise<void> => {
  await navigator.clipboard?.writeText(exportCode.value);
  status.set(pick("配置已复制", "Configuration copied"));
};
const downloadExport = (): void => {
  if (typeof document === "undefined") return;
  const extension = exportFormat.value === "config" ? "ts" : exportFormat.value;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([exportCode.value], { type: "text/plain;charset=utf-8" }),
  );
  link.download = `${schemeName.value || "elfui-theme"}.${extension}`;
  link.click();
  URL.revokeObjectURL(link.href);
  status.set(pick("配置已导出", "Theme exported"));
};
const openImport = (): void => importFile.value?.click();
const importTheme = async (event: Event): Promise<void> => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text()) as {
      name?: string;
      dark?: boolean;
      tokens?: ThemeTokens;
      theme?: { tokens?: ThemeTokens };
    };
    const importedTokens = payload.tokens || payload.theme?.tokens;
    if (!importedTokens || typeof importedTokens !== "object") throw new Error("tokens missing");
    tokens.set({ ...tokens.value, ...importedTokens });
    schemeName.set(payload.name || "elfui-imported");
    selectedPreset.set(payload.dark ? "midnight" : "material");
    status.set(pick("主题导入成功", "Theme imported"));
  } catch {
    status.set(pick("无法读取该主题文件", "Unable to read this theme file"));
  }
  (event.target as HTMLInputElement).value = "";
};

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null") as {
      preset?: string;
      name?: string;
      tokens?: ThemeTokens;
    } | null;
    if (saved?.tokens) {
      selectedPreset.set(getThemePreset(saved.preset || "material").id);
      schemeName.set(saved.name || "elfui-custom");
      tokens.set({ ...saved.tokens });
    }
  } catch {
    /* Ignore unavailable or invalid local drafts. */
  }
});

useEffect(() => {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        preset: selectedPreset.value,
        name: schemeName.value,
        tokens: tokens.value,
      }),
    );
  } catch {
    /* Storage is optional. */
  }
});

defineStyle(styles);

const PageThemeStudio = defineHtml(`
  <main class="theme-studio" :data-mobile-view=${mobileView.value}>
    <header class="studio-hero">
      <div>
        <span class="eyebrow">${t("eyebrow")}</span>
        <h1>${t("title")}</h1>
        <p>${t("description")}</p>
      </div>
      <div class="hero-actions">
        <input ref="importFile" class="file-input" type="file" accept="application/json,.json" @change=${importTheme} />
        <elf-button variant="outlined" @click=${openImport}><elf-icon name="⇧" size="16"></elf-icon>${pick("导入", "Import")}</elf-button>
        <elf-button @click=${downloadExport}><elf-icon name="⇩" size="16"></elf-icon>${pick("导出", "Export")}</elf-button>
      </div>
    </header>

    <section class="preset-section" aria-labelledby="preset-title">
      <div class="section-heading">
        <div><span class="section-index">01</span><h2 id="preset-title">${t("presets")}</h2></div>
        <span>${pick("品牌色与明暗外观分离", "Brand color and appearance stay independent")}</span>
      </div>
      <div class="preset-grid">
        <button
          v-for="preset in THEME_PRESETS"
          :key="preset.id"
          type="button"
          :class="['preset-card', { 'is-selected': selectedPreset.value === preset.id }]"
          :data-preset="preset.id"
          :aria-pressed="selectedPreset.value === preset.id ? 'true' : 'false'"
          @click=${selectPreset}
        >
          <span class="preset-copy"><strong>{{ presetLabel(preset) }}</strong><small>{{ preset.dark ? 'Dark' : 'Light' }}</small></span>
          <span class="preset-swatches" aria-hidden="true">
            <i :style="{ background: preset.tokens.primary }"></i>
            <i :style="{ background: preset.tokens.primaryHover }"></i>
            <i :style="{ background: preset.tokens.primaryActive }"></i>
            <i :style="{ background: preset.tokens.bgOverlay }"></i>
          </span>
        </button>
      </div>

      <div class="material-library">
        <div class="material-heading">
          <div>
            <h3>${pick("Material 色板库", "Material color library")}</h3>
            <p>${pick("参考 Vuetify 的颜色家族与色阶；点击色阶会写入所选语义 Token。", "Inspired by Vuetify color families and tones. Pick a tone to update the selected semantic token.")}</p>
          </div>
          <label class="palette-search">
            <span>${pick("搜索色系", "Search colors")}</span>
            <input
              type="search"
              :value.prop=${materialQuery.value}
              :placeholder=${pick("例如：蓝色、teal", "For example: blue or teal")}
              @input=${updateMaterialQuery}
            />
          </label>
        </div>

        <div class="palette-targets" role="group" :aria-label=${pick("应用到 Token", "Apply to token")}>
          <span>${pick("应用到", "Apply to")}</span>
          <button
            v-for="target in PALETTE_TARGETS"
            :key="target"
            type="button"
            :data-target="target"
            :aria-pressed="paletteTarget.value === target"
            @click=${selectPaletteTarget}
          >{{ paletteTargetLabel(target) }}</button>
        </div>

        <div class="material-family-grid">
          <button
            v-for="palette in filteredMaterialPalettes.value"
            :key="palette.id"
            type="button"
            :class="['material-family', { 'is-selected': selectedMaterialFamily.value === palette.id }]"
            :data-family="palette.id"
            :aria-pressed="selectedMaterialFamily.value === palette.id"
            @click=${selectMaterialFamily}
          >
            <span>{{ materialFamilyLabel(palette) }}</span>
            <i aria-hidden="true"><b v-for="color in palettePreviewColors(palette)" :key="color" :style="{ background: color }"></b></i>
          </button>
          <p v-if="filteredMaterialPalettes.value.length === 0" class="palette-empty">${pick("没有匹配的颜色家族", "No color families found")}</p>
        </div>

        <div class="tone-panel">
          <div class="tone-heading">
            <span><strong>${materialFamilyLabel(activeMaterialPalette.value)}</strong><small>${pick("选择色阶", "Choose a tone")}</small></span>
            <span>${pick("当前目标", "Current target")}: <strong>${paletteTargetLabel(paletteTarget.value)}</strong></span>
          </div>
          <div class="tone-grid">
            <button
              v-for="entry in activeMaterialTones.value"
              :key="entry.tone"
              type="button"
              :data-tone="entry.tone"
              :data-color="entry.color"
              :style="{ background: entry.color, color: swatchTextColor(entry.color) }"
              :aria-label="materialToneAriaLabel(entry)"
              @click=${applyMaterialTone}
            ><strong>{{ TONE_LABELS[entry.tone] }}</strong><small>{{ entry.color }}</small></button>
          </div>
        </div>
      </div>
    </section>

    <div class="mobile-switch" role="tablist" :aria-label=${pick("工作台视图", "Studio view")}>
      <button type="button" role="tab" data-view="editor" :aria-selected=${mobileView.value === "editor"} @click=${setMobileView}>${t("editor")}</button>
      <button type="button" role="tab" data-view="preview" :aria-selected=${mobileView.value === "preview"} @click=${setMobileView}>${t("preview")}</button>
    </div>

    <div class="studio-grid">
      <aside class="editor-panel">
        <div class="panel-heading">
          <div><span class="section-index">02</span><h2>${t("editor")}</h2></div>
          <button class="text-action" type="button" @click=${resetTheme}>↺ ${pick("重置", "Reset")}</button>
        </div>

        <label class="scheme-name">
          <span>${pick("方案名称", "Scheme name")}</span>
          <input :value.prop=${schemeName.value} @input=${updateName} />
        </label>

        <div class="mode-switch" role="tablist" :aria-label=${pick("编辑模式", "Editor mode")}>
          <button type="button" role="tab" data-mode="basic" :aria-selected=${editorMode.value === "basic"} @click=${setEditorMode}>${t("basic")}</button>
          <button type="button" role="tab" data-mode="advanced" :aria-selected=${editorMode.value === "advanced"} @click=${setEditorMode}>${t("advanced")}</button>
        </div>

        <div class="token-list">
          <div v-for="field in editorFields.value" :key="field.key" class="token-row">
            <span><strong>{{ field.label }}</strong><small>{{ field.group }}</small></span>
            <elf-color-picker
              :data-token="field.key"
              :modelValue.prop="tokenValue(field.key)"
              :ariaLabel="field.label"
              size="small"
              @update:modelValue=${updateToken}
            ><span slot="color" class="token-swatch" :style="{ background: tokenValue(field.key) }"></span></elf-color-picker>
          </div>
        </div>

        <section class="contrast-card" aria-labelledby="contrast-title">
          <div><h3 id="contrast-title">${pick("对比度检查", "Contrast check")}</h3><span>WCAG AA</span></div>
          <p><span>${pick("主按钮文字", "Primary button text")}</span><strong :class=${{ pass: primaryContrast.value >= 4.5 }}>${primaryContrast.value.toFixed(2)}:1</strong></p>
          <p><span>${pick("表面正文", "Surface text")}</span><strong :class=${{ pass: surfaceContrast.value >= 4.5 }}>${surfaceContrast.value.toFixed(2)}:1</strong></p>
        </section>

        <section class="export-card" aria-labelledby="export-title">
          <div class="export-heading"><h3 id="export-title">${t("export")}</h3><button type="button" @click=${copyExport}>⧉ ${pick("复制", "Copy")}</button></div>
          <div class="format-switch">
            <button v-for="format in ['config', 'json', 'css']" :key="format" type="button" :data-format="format" :aria-pressed="exportFormat.value === format" @click=${setExportFormat}>{{ format === 'config' ? 'TypeScript' : format.toUpperCase() }}</button>
          </div>
          <textarea readonly :value.prop=${exportCode.value} :aria-label=${pick("导出配置预览", "Export preview")}></textarea>
        </section>
      </aside>

      <section class="preview-panel">
        <div class="panel-heading preview-heading">
          <div><span class="section-index">03</span><h2>${t("preview")}</h2></div>
          <span class="live-indicator"><i></i>LIVE</span>
        </div>
        <elf-theme-provider theme="custom" :tokens.prop=${tokens.value} :inherit.prop=${false}>
          <div class="preview-canvas">
            <header class="preview-toolbar">
              <span class="preview-logo">E</span>
              <div><strong>ElfUI Workspace</strong><small>${pick("主题系统预览", "Theme system preview")}</small></div>
              <elf-tag type="success" size="small">${pick("在线", "Online")}</elf-tag>
            </header>

            <div class="preview-content">
              <section class="preview-summary">
                <span>${pick("本周组件采用率", "Weekly component adoption")}</span>
                <strong>84.6%</strong>
                <small>${pick("较上周提升 12.4%", "Up 12.4% from last week")}</small>
              </section>
              <section class="preview-actions">
                <elf-button>${pick("创建项目", "Create project")}</elf-button>
                <elf-button variant="outlined">${pick("查看报告", "View report")}</elf-button>
                <elf-button variant="text">${pick("了解更多", "Learn more")}</elf-button>
                <elf-button disabled>${pick("已禁用", "Disabled")}</elf-button>
              </section>

              <div class="preview-form-row">
                <elf-input :modelValue.prop=${pick("设计系统", "Design system")} :label=${pick("项目名称", "Project name")} clearable></elf-input>
                <div class="tag-stack"><elf-tag>${pick("默认", "Default")}</elf-tag><elf-tag type="success">${pick("成功", "Success")}</elf-tag><elf-tag type="warning">${pick("警告", "Warning")}</elf-tag></div>
              </div>

              <elf-alert type="info" variant="soft" :showIcon.prop=${false} :title=${pick("主题已连接", "Theme connected")} :description=${pick("这些真实组件正在消费当前编辑的语义 Token。", "These real components consume the semantic tokens you are editing.")}></elf-alert>

              <elf-card class="preview-card">
                <div class="card-title"><div><span>${pick("组件状态", "Component status")}</span><strong>${pick("发布概览", "Release overview")}</strong></div><elf-badge value="3" type="primary"><span class="badge-anchor">●</span></elf-badge></div>
                <elf-table size="small" :data.prop=${previewRows} :columns.prop=${previewColumns} row-key="id" border></elf-table>
              </elf-card>
            </div>
          </div>
        </elf-theme-provider>
      </section>
    </div>

    <p class="studio-status" role="status" aria-live="polite">${status.value}</p>
  </main>
`);

export { PageThemeStudio };
