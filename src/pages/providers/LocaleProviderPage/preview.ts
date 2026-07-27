import { defineHtml, inject } from "@elfui/core";

import { DEFAULT_LOCALE_CONTEXT, LOCALE_PROVIDER_KEY } from "../../../components/Providers/context";

const locale = inject(LOCALE_PROVIDER_KEY, DEFAULT_LOCALE_CONTEXT) ?? DEFAULT_LOCALE_CONTEXT;

const PageLocaleProviderPreview = defineHtml(`
  <div
    :dir=${locale.dir}
    style="display:grid;gap:8px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
  >
    <strong>{{ locale.t('provider.title') }}</strong>
    <span style="color:var(--elf-text-secondary)"
      >locale: {{ locale.name }} / {{ locale.dir }}</span
    >
    <span style="color:var(--elf-text-secondary)">
      {{ locale.formatNumber(123456.78, { style: 'currency', currency: 'USD' }) }} ·
      {{ locale.formatDate('2026-07-22T08:00:00Z', { year: 'numeric', month: 'short', day: '2-digit' }) }}
    </span>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <elf-button size="sm">{{ locale.t('common.confirm') }}</elf-button>
      <elf-button size="sm" variant="outlined">{{ locale.t('common.cancel') }}</elf-button>
    </div>
  </div>
`);

export { PageLocaleProviderPreview };
