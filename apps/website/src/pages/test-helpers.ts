import { vi } from "vitest";

const MD_PAGE_DEMO = "# Remote demo\n\nLoaded from the local documentation fixture.";

/** Keeps documentation-page tests deterministic and rejects accidental network access. */
export const stubMdPageDemoFetch = (): void => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (!url.endsWith("/md-page-demo.md")) {
        return Promise.reject(new Error(`Unexpected documentation test request: ${url}`));
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(MD_PAGE_DEMO),
      } as Response);
    }),
  );
};
