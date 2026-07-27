import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageAvatarEx1 } from "./ex1";
import { PageAvatarEx2 } from "./ex2";
import { PageAvatarEx3 } from "./ex3";
import { PageAvatarProps } from "./props";

useComponents({
  "page-avatar-ex1": PageAvatarEx1,
  "page-avatar-ex2": PageAvatarEx2,
  "page-avatar-ex3": PageAvatarEx3,
  "page-avatar-props": PageAvatarProps
});

const t = createDocsTranslator({
  title: { zh: "Avatar 头像", en: "Avatar" },
  description: {
    zh: "用于识别人物或实体，支持文字、图片、图标、失败回退和团队溢出。",
    en: "Identifies people or entities with text, images, icons, failure fallback, and team overflow."
  }
});

const PageAvatar = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-avatar-ex1 /><page-avatar-ex2 /><page-avatar-ex3 /><page-avatar-props
  /></elf-container>
`);

export { PageAvatar };
