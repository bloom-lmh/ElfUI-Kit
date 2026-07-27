import { defineHtml, useRef } from "@elfui/core";

const remoteKeyword = useRef("");

const fetchSuggestions = async (query: string) => {
  const source = [
    { label: "杭州 West Lake", value: "Hangzhou" },
    { label: "上海 Pudong", value: "Shanghai" },
    { label: "深圳 Nanshan", value: "Shenzhen" },
    { label: "北京 Chaoyang", value: "Beijing" }
  ];
  return source.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};

const code2 = `<elf-autocomplete
  :fetchSuggestions.prop=\${fetchSuggestions}
  :modelValue=\${remoteKeyword}
  placeholder="远程搜索城市"
  @update:modelValue=\${onRemoteUpdate}
/>`;

const script2 = `const remoteKeyword = useRef("");

const fetchSuggestions = async (query) => {
  const source = [
    { label: "杭州 West Lake", value: "Hangzhou" },
    { label: "上海 Pudong", value: "Shanghai" },
    { label: "深圳 Nanshan", value: "Shenzhen" },
    { label: "北京 Chaoyang", value: "Beijing" }
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
<elf-playground title="异步建议" :code=${code2} :script=${script2}>
      <elf-autocomplete
        :fetchSuggestions.prop=${fetchSuggestions}
        :modelValue=${remoteKeyword}
        placeholder="远程搜索城市"
        @update:modelValue=${onRemoteUpdate}
      ></elf-autocomplete>
    </elf-playground>
`);

export { PageAutocompleteEx2 };
