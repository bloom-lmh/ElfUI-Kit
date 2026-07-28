import { defineHtml } from "@elfui/core";

import { useConfigProvider } from "../config";

const config = useConfigProvider();

const ConfigProviderProbe = defineHtml(`
  <output data-config>
    {{ config.display.name }}|{{ config.display.mobile ? 'mobile' : 'desktop' }}|
    {{ config.reducedMotion ? 'reduced' : 'full' }}
  </output>
`);

export { ConfigProviderProbe };
