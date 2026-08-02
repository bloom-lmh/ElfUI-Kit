import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "异步建议", en: "Async suggestions" },
  placeholder: { zh: "远程搜索城市", en: "Search cities remotely" },
  hangzhou: { zh: "杭州西湖", en: "Hangzhou West Lake" },
  shanghai: { zh: "上海浦东", en: "Shanghai Pudong" },
  shenzhen: { zh: "深圳南山", en: "Shenzhen Nanshan" },
  beijing: { zh: "北京朝阳", en: "Beijing Chaoyang" },
});

const remoteKeyword = useRef("");

const fetchSuggestions = async (query: string) => {
  const source = [
    { label: t("hangzhou"), value: "Hangzhou" },
    { label: t("shanghai"), value: "Shanghai" },
    { label: t("shenzhen"), value: "Shenzhen" },
    { label: t("beijing"), value: "Beijing" },
  ];
  return source.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};

const code2 = `<elf-autocomplete
  :fetchSuggestions.prop=\${fetchSuggestions}
  :modelValue=\${remoteKeyword}
  placeholder="${t("placeholder")}"
  @update:modelValue=\${onRemoteUpdate}
/>`;

const script2 = `const remoteKeyword = useRef("");

const fetchSuggestions = async (query) => {
  const source = [
    { label: "${t("hangzhou")}", value: "Hangzhou" },
    { label: "${t("shanghai")}", value: "Shanghai" },
    { label: "${t("shenzhen")}", value: "Shenzhen" },
    { label: "${t("beijing")}", value: "Beijing" }
  ];
  return source.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};

const onRemoteUpdate = (event) => {
    remoteKeyword.set(String(event.detail || ""));
};`;

const onRemoteUpdate = (event: CustomEvent): void => {
  remoteKeyword.set(String(event.detail || ""));
};

const PageAutocompleteEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2} :script=${script2}>
      <elf-autocomplete
        :fetchSuggestions.prop=${fetchSuggestions}
        :modelValue=${remoteKeyword}
        :placeholder=${t("placeholder")}
        @update:modelValue=${onRemoteUpdate}
      ></elf-autocomplete>
    </elf-playground>
`);

export { PageAutocompleteEx2 };
