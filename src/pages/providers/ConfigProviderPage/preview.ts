import { defineHtml } from "@elfui/core";

import { useConfigProvider } from "../../../components/Providers/config";

const config = useConfigProvider();

const PageConfigProviderPreview = defineHtml(`
  <div class="config-preview">
    <div class="preview-stat">
      <span class="preview-label">Breakpoint</span>
      <strong>{{ config.display.name }}</strong>
      <small>{{ config.display.width }} × {{ config.display.height }}</small>
    </div>
    <div class="preview-stat">
      <span class="preview-label">Mobile</span>
      <strong>{{ config.display.mobile ? 'true' : 'false' }}</strong>
      <small>reduced motion: {{ config.reducedMotion ? 'true' : 'false' }}</small>
    </div>
  </div>
`);

export { PageConfigProviderPreview };
