import { defineHtml } from "@elfui/core";

import { useLocaleProvider } from "../context";

const locale = useLocaleProvider();

const LocaleProviderProbe = defineHtml(`
  <span class="value">${locale.name}|${locale.dir}|${locale.t('common.confirm')}</span>
`);

const LocaleProviderFormatProbe = defineHtml(`
  <span class="value">
    ${locale.formatNumber(1234.5, { style: 'currency', currency: 'USD' })}|
    ${locale.formatDate('2026-07-22T08:00:00Z', { year: 'numeric', month: 'short', day: '2-digit' })}
  </span>
`);

export { LocaleProviderFormatProbe, LocaleProviderProbe };
