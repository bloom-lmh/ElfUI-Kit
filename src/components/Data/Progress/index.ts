import { defineProps, defineStyle, useHostAttr, useHostCssVar, useHostFlag, defineHtml } from "@elfui/core";

import styles from "./style.scss?inline";
import type { ProgressProps, ProgressStatus, ProgressType, ProgressVariant } from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type { ProgressProps, ProgressStatus, ProgressType, ProgressVariant } from "./types";

const props = defineProps({
    percentage: { type: Number, default: undefined },
    type: { type: String, default: "" },
    value: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    variant: { type: String, default: "line" },
    status: { type: String, default: "" },
    color: { type: String, default: "" },
    trackColor: { type: String, default: "" },
    height: { type: String, default: "" },
    transitionDuration: { type: Number, default: 0.4 },
    duration: { type: Number, default: 3 },
    width: { type: Number, default: 126 },
    size: { type: Number, default: 0 },
    strokeWidth: { type: Number, default: 6 },
    strokeLinecap: { type: String, default: "round" },
    showText: { type: Boolean, default: true },
    textInside: { type: Boolean, default: false },
    striped: { type: Boolean, default: false },
    stripedFlow: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    format: { type: Function, default: undefined },
}) as unknown as Readonly<ProgressProps>;

const locale = useLocaleProvider();

const max = (): number => Math.max(1, Number(props.max) || 100);

const value = (): number => Math.min(Math.max(0, Number(props.value) || 0), max());

const percent = (): number => {
    if (props.percentage !== undefined && props.percentage !== null) {
        return Math.min(Math.max(0, Number(props.percentage) || 0), 100);
    }
    return Math.round((value() / max()) * 100);
};

const progressType = (): ProgressType => {
    if (props.type === "circle" || props.type === "dashboard") return props.type;
    if (props.type === "line") return "line";
    return props.variant === "circle" ? "circle" : "line";
};

const normalizedStatus = (): ProgressStatus => {
    const status = String(props.status || "") as ProgressStatus;
    if (status) return status;
    return percent() >= 100 ? "success" : "primary";
};

const tokenColor = (): string => {
    if (props.color) return String(props.color);
    switch (normalizedStatus()) {
        case "success":
            return "var(--elf-success)";
        case "warning":
            return "var(--elf-warning)";
        case "danger":
        case "exception":
            return "var(--elf-danger)";
        case "info":
            return "var(--elf-info)";
        default:
            return "var(--elf-primary)";
    }
};

const label = (): string => {
    const formatter = props.format;
    if (typeof formatter === "function") return formatter(percent(), value());
    return props.indeterminate ? locale.t("loading.active") : `${percent()}%`;
};

const circleSize = (): string => `${Math.max(40, Number(props.size) || Number(props.width) || 126)}px`;

const stroke = (): number => Math.min(Math.max(2, Number(props.strokeWidth) || 8), 24);

const radius = (): number => 50 - stroke() / 2;

const dashArray = (): string => (progressType() === "dashboard" ? "75 100" : "100");

const dashOffset = (): number => {
    if (props.indeterminate) return progressType() === "dashboard" ? 54 : 72;
    return progressType() === "dashboard" ? 75 - percent() * 0.75 : 100 - percent();
};

const normalizedLinecap = (): "butt" | "round" | "square" => {
    return props.strokeLinecap === "butt" || props.strokeLinecap === "square" ? props.strokeLinecap : "round";
};

const duration = (): string => `${Math.max(0.1, Number(props.duration) || 3)}s`;
const transitionDuration = (): string => `${Math.max(0, Number(props.transitionDuration) || 0)}s`;
const usesPercentage = (): boolean => props.percentage !== undefined && props.percentage !== null;
const ariaMaximum = (): number => (usesPercentage() ? 100 : max());
const ariaCurrent = (): number => (usesPercentage() ? percent() : value());

useHostAttr("data-type", progressType);
useHostAttr("status", normalizedStatus);
useHostFlag("data-indeterminate", () => Boolean(props.indeterminate));
useHostFlag("data-striped", () => Boolean(props.striped || props.stripedFlow));
useHostFlag("data-striped-flow", () => Boolean(props.stripedFlow));
useHostFlag("data-text-inside", () => Boolean(props.textInside));
useHostCssVar("--_progress-percent", () => `${props.indeterminate ? 42 : percent()}%`);
useHostCssVar("--_progress-color", tokenColor);
useHostCssVar("--_progress-track", () => props.trackColor || "var(--elf-bg-overlay)");
useHostCssVar("--_progress-height", () => props.height || `${stroke()}px`);
useHostCssVar("--_progress-size", circleSize);
useHostCssVar("--_progress-stroke", () => String(stroke()));
useHostCssVar("--_progress-duration", duration);
useHostCssVar("--_progress-transition-duration", transitionDuration);
useHostCssVar("--_progress-linecap", normalizedLinecap);

defineStyle(styles);

const Progress = defineHtml(`
    <div
        class="progress"
        role="progressbar"
        :aria-valuemin=${0}
        :aria-valuemax=${ariaMaximum()}
        :aria-valuenow=${props.indeterminate ? null : ariaCurrent()}
        :aria-valuetext=${label()}
    >
        <div v-if=${progressType() === "line"} class="line">
            <div class="line-track">
                <div class="line-value"></div>
                <span v-if=${props.showText && props.textInside} class="line-text inside"><slot>${label()}</slot></span>
            </div>
            <span v-if=${props.showText && !props.textInside} class="line-text"><slot>${label()}</slot></span>
        </div>

        <div v-else class="circle">
            <svg class="circle-svg" viewBox="0 0 100 100" aria-hidden="true">
                <circle class="circle-track" cx="50" cy="50" :r=${radius()} pathLength="100" fill="none" />
                <circle
                    class="circle-value"
                    cx="50"
                    cy="50"
                    :r=${radius()}
                    pathLength="100"
                    fill="none"
                    :stroke-dasharray=${dashArray()}
                    :stroke-dashoffset=${dashOffset()}
                />
            </svg>
            <span v-if=${props.showText} class="circle-text"><slot>${label()}</slot></span>
        </div>
    </div>
`);

export { Progress };
