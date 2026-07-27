import { defineHtml, useRef } from "@elfui/core";

const active = useRef("#anchor-links-overview");

const onChange = (event: CustomEvent<{ href: string }>): void => {
  active.set(event.detail.href);
};

const code = `<elf-anchor
  container="#anchor-links-scroll"
  :modelValue=\${active}
  @change=\${onChange}
>
  <elf-anchor-link href="#anchor-links-overview" title="Overview" />
  <elf-anchor-link href="#anchor-links-guide" title="Guide">
    <elf-anchor-link slot="sub-link" href="#anchor-links-api" title="API" />
  </elf-anchor-link>
</elf-anchor>`;

const script = `const active = useRef("#anchor-links-overview");

const onChange = (event) => {
  active.set(event.detail.href);
};`;

const PageAnchorEx3 = defineHtml(`
  <h2>Compositional links</h2>
  <elf-playground title="AnchorLink and nested sub-link" :code=${code} :script=${script}>
    <div
      style="display:grid;grid-template-columns:minmax(160px,220px) 1fr;gap:20px;width:100%;max-width:860px"
    >
      <elf-anchor
        container="#anchor-links-scroll"
        :modelValue.prop=${active.value}
        @change=${onChange}
      >
        <elf-anchor-link href="#anchor-links-overview" title="Overview"></elf-anchor-link>
        <elf-anchor-link href="#anchor-links-guide" title="Guide">
          <elf-anchor-link
            slot="sub-link"
            href="#anchor-links-api"
            title="API"
          ></elf-anchor-link>
        </elf-anchor-link>
      </elf-anchor>
      <div
        id="anchor-links-scroll"
        style="height:280px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <section id="anchor-links-overview" style="min-height:220px;padding:20px">
          <h3>Overview</h3>
          <p>Use AnchorLink when navigation content should be declared directly in markup.</p>
        </section>
        <section
          id="anchor-links-guide"
          style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>Guide</h3>
          <p>The default slot customizes a link label, while sub-link creates nesting.</p>
        </section>
        <section
          id="anchor-links-api"
          style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)"
        >
          <h3>API</h3>
          <p>The parent keeps every compositional link synchronized with the active target.</p>
        </section>
      </div>
    </div>
  </elf-playground>
`);

export { PageAnchorEx3 };
