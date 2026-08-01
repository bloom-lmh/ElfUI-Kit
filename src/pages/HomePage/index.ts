import { defineHtml, defineStyle } from "@elfui/core";

import { useLocaleProvider } from "../../components/Providers/context";
import { createDocsPicker } from "../docsLocale";
import styles from "./style.scss?inline";

// Injected context
const locale = useLocaleProvider();

// Derived content
const t = (key: string): string => locale.t(`home.${key}`);
const pick = createDocsPicker();

defineStyle(styles);

const PageHome = defineHtml(`
  <main class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span>${t("eyebrow")}</div>
        <h1 id="home-title">ELFUI-KIT</h1>
        <p class="hero-tagline">${t("titleLead")} <span>${t("titleAccent")}</span></p>
        <p class="hero-description">${t("description")}</p>

        <div class="hero-actions">
          <elf-link class="action action-primary" to="/overview" .underline=${false}>
            ${t("primaryAction")}<span aria-hidden="true">→</span>
          </elf-link>
          <elf-link class="action action-secondary" to="/providers/theme" .underline=${false}>
            ${t("secondaryAction")}<span aria-hidden="true">↗</span>
          </elf-link>
        </div>

        <div class="proof" :aria-label=${t("proofLabel")}>
          <span><b>90+</b>${t("proofComponents")}</span>
          <span><b>900+</b>${t("proofTests")}</span>
          <span><b>0</b>${t("proofRuntime")}</span>
        </div>
      </div>

      <div class="hero-visual" :aria-label=${t("visualLabel")}>
        <div class="visual-glow"></div>
        <div class="window">
          <div class="window-bar">
            <span class="window-dots"><i></i><i></i><i></i></span>
            <span>dashboard.ts</span>
            <span class="window-status">${t("live")}</span>
          </div>
          <div class="window-body">
            <div class="mini-nav">
              <span class="mini-brand">E</span>
              <span class="mini-line is-active"></span>
              <span class="mini-line"></span>
              <span class="mini-line is-short"></span>
            </div>
            <div class="mini-content">
              <div class="mini-heading">
                <span><small>${t("visualEyebrow")}</small>${t("visualTitle")}</span>
                <i></i>
              </div>
              <div class="metric-grid">
                <article><small>${t("metricRevenue")}</small><b>${pick("¥ 86,420", "$86,420")}</b><em>+18.4%</em></article>
                <article><small>${t("metricUsers")}</small><b>12,860</b><em>+9.2%</em></article>
              </div>
              <div class="chart-card">
                <div class="chart-title"><span>${t("metricActivity")}</span><small>${t("metricWeek")}</small></div>
                <div class="chart" aria-hidden="true">
                  <i style="--h:34%"></i><i style="--h:52%"></i><i style="--h:44%"></i>
                  <i style="--h:72%"></i><i style="--h:62%"></i><i style="--h:88%"></i><i style="--h:76%"></i>
                </div>
              </div>
              <div class="floating-chip"><span>✓</span>${t("visualReady")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
`);

export { PageHome };
