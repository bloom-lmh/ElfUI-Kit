import { registerComponents } from "@elfui/core";

import { Heatmap } from "./Heatmap";
import { Video } from "./Video";

registerComponents(Video, Heatmap);

export * from "./Heatmap";
export * from "./Video";
