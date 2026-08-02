import { defineHtml } from "@elfui/core";

import { useConfigProvider } from "../config";

const config = useConfigProvider();

const ConfigProviderProbe = defineHtml(`
  <output data-config>
    {{ config.display.name }}|{{ config.display.mobile ? 'mobile' : 'desktop' }}|
    {{ config.reducedMotion ? 'reduced' : 'full' }}|
    {{ config.config.goTo?.duration ?? 0 }}|
    {{ config.config.goTo?.easing ?? 'default' }}
  </output>
`);

export { ConfigProviderProbe };
