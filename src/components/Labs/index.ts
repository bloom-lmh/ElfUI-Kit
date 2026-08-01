import { registerComponents } from "@elfui/core";

import { CodeCard } from "./CodeCard";
import { Heatmap } from "./Heatmap";
import { Video } from "./Video";

registerComponents(Video, Heatmap, CodeCard);

export * from "./CodeCard";
export * from "./Heatmap";
export * from "./Video";
