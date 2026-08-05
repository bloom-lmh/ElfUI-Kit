import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./ex1.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  title: { zh: "配置优先级", en: "Config priority" },
  intro: {
    zh: "开关控制三层配置，目标按钮实时显示生效值：显式属性 > 应用配置 > 基础预设。",
    en: "Toggle the three configuration layers and watch the target button update in real time: explicit props > app config > blueprint.",
  },
  blueprintLabel: { zh: "基础预设", en: "Blueprint" },
  blueprintDesc: {
    zh: "defaults: size=sm · variant=outlined",
    en: "defaults: size=sm · variant=outlined",
  },
  configLabel: { zh: "应用配置", en: "App config" },
  configDesc: {
    zh: "defaults: color=success",
    en: "defaults: color=success",
  },
  explicitLabel: { zh: "显式属性", en: "Explicit props" },
  explicitDesc: {
    zh: "variant=contained · color=warning",
    en: "variant=contained · color=warning",
  },
  target: { zh: "目标按钮", en: "Target button" },
  effectiveTitle: { zh: "当前生效值", en: "Effective values" },
  priorityRule: {
    zh: "优先级规则：显式属性 > 应用配置 > 基础预设",
    en: "Precedence: explicit props > app config > blueprint",
  },
  fromBlueprint: { zh: "来自基础预设", en: "from blueprint" },
  fromConfig: { zh: "来自应用配置", en: "from app config" },
  fromExplicit: { zh: "来自显式属性", en: "from explicit props" },
  fromDefault: { zh: "组件默认值", en: "component default" },
  size: { zh: "尺寸", en: "Size" },
  variant: { zh: "样式", en: "Variant" },
  color: { zh: "颜色", en: "Color" },
  codeComment: {
    zh: "优先级：显式属性 > config > blueprint",
    en: "Precedence: explicit props > config > blueprint",
  },
});

const blueprintOn = useRef(true);
const configOn = useRef(true);
const explicitOn = useRef(true);

const blueprint = (): Record<string, unknown> => ({
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" },
  },
});

const config = (): Record<string, unknown> => ({
  defaults: {
    "elf-button": { color: "success" },
  },
});

const effectiveSize = (): "sm" | "md" => (blueprintOn.value ? "sm" : "md");
const effectiveVariant = (): "outlined" | "contained" =>
  explicitOn.value ? "contained" : blueprintOn.value ? "outlined" : "contained";
const effectiveColor = (): "warning" | "success" | "primary" =>
  explicitOn.value ? "warning" : configOn.value ? "success" : "primary";

const sizeSource = (): string => (blueprintOn.value ? t("fromBlueprint") : t("fromDefault"));
const variantSource = (): string =>
  explicitOn.value ? t("fromExplicit") : blueprintOn.value ? t("fromBlueprint") : t("fromDefault");
const colorSource = (): string =>
  explicitOn.value ? t("fromExplicit") : configOn.value ? t("fromConfig") : t("fromDefault");

const onBlueprintToggle = (event: CustomEvent<boolean>): void => {
  blueprintOn.set(Boolean(event.detail));
};
const onConfigToggle = (event: CustomEvent<boolean>): void => {
  configOn.set(Boolean(event.detail));
};
const onExplicitToggle = (event: CustomEvent<boolean>): void => {
  explicitOn.set(Boolean(event.detail));
};

const code = `<elf-config-provider :blueprint.prop="blueprint" :config.prop="config">
  <elf-button variant="contained" color="warning">
    ${t("target")}
  </elf-button>
</elf-config-provider>

// ${t("codeComment")}`;

const script = `const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" }
  }
};
const config = {
  defaults: {
    "elf-button": { color: "success" }
  }
};

// ${t("codeComment")}`;

const PageConfigProviderEx1 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <div class="priority-demo">
      <p class="priority-intro">${t("intro")}</p>
      <div class="priority-layers">
        <div class="priority-layer">
          <elf-switch
            :modelValue.prop=${blueprintOn.value}
            @update:modelValue=${onBlueprintToggle}
          ></elf-switch>
          <span class="priority-layer-copy">
            <strong>${t("blueprintLabel")}</strong>
            <small>${t("blueprintDesc")}</small>
          </span>
        </div>
        <div class="priority-layer">
          <elf-switch
            :modelValue.prop=${configOn.value}
            @update:modelValue=${onConfigToggle}
          ></elf-switch>
          <span class="priority-layer-copy">
            <strong>${t("configLabel")}</strong>
            <small>${t("configDesc")}</small>
          </span>
        </div>
        <div class="priority-layer">
          <elf-switch
            :modelValue.prop=${explicitOn.value}
            @update:modelValue=${onExplicitToggle}
          ></elf-switch>
          <span class="priority-layer-copy">
            <strong>${t("explicitLabel")}</strong>
            <small>${t("explicitDesc")}</small>
          </span>
        </div>
      </div>
      <div class="priority-stage">
        <div class="priority-stage-actions">
          <elf-config-provider :blueprint.prop=${blueprint()} :config.prop=${config()}>
            <elf-button
              :size=${effectiveSize()}
              :variant=${effectiveVariant()}
              :color=${effectiveColor()}
            >${t("target")}</elf-button>
          </elf-config-provider>
          <span class="priority-rule">${t("priorityRule")}</span>
        </div>
        <div class="priority-effective">
          <span class="priority-effective-title">${t("effectiveTitle")}</span>
          <span class="priority-effective-row">
            <b>${t("size")}</b>
            <code>${effectiveSize()}</code>
            <em>${sizeSource()}</em>
          </span>
          <span class="priority-effective-row">
            <b>${t("variant")}</b>
            <code>${effectiveVariant()}</code>
            <em>${variantSource()}</em>
          </span>
          <span class="priority-effective-row">
            <b>${t("color")}</b>
            <code>${effectiveColor()}</code>
            <em>${colorSource()}</em>
          </span>
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageConfigProviderEx1 };
