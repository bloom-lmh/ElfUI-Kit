import { registerComponents } from "@elfui/core";

import { ApiBuilder } from "./ApiBuilder";
import { DocsHero } from "./DocsHero";
import { DocsToc } from "./DocsToc";
import { OverviewCard } from "./OverviewCard";
import { Playground } from "./Playground";
import { PropsTable } from "./PropsTable";

registerComponents(DocsHero, DocsToc, OverviewCard, Playground, PropsTable, ApiBuilder);

export { ApiBuilder } from "./ApiBuilder";
export { DocsHero } from "./DocsHero";
export { DocsToc } from "./DocsToc";
export { OverviewCard } from "./OverviewCard";
export { Playground } from "./Playground";
export { PropsTable } from "./PropsTable";
