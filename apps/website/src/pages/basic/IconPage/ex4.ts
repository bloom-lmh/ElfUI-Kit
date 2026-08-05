import { defineHtml, defineStyle, onUnmounted, useRef } from "@elfui/core";
import {
  mdiAccountOutline,
  mdiAirplane,
  mdiAlertOutline,
  mdiArrowDown,
  mdiArrowLeft,
  mdiArrowRight,
  mdiArrowUp,
  mdiBattery,
  mdiBellOutline,
  mdiBookmarkOutline,
  mdiCalendarOutline,
  mdiCameraOutline,
  mdiCarOutline,
  mdiCartOutline,
  mdiCellphone,
  mdiChartLine,
  mdiCheck,
  mdiCheckCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClockOutline,
  mdiClose,
  mdiCloudOutline,
  mdiCodeTags,
  mdiCoffeeOutline,
  mdiCogOutline,
  mdiCreditCardOutline,
  mdiDatabaseOutline,
  mdiDeleteOutline,
  mdiDownloadOutline,
  mdiEmailOutline,
  mdiEyeOutline,
  mdiFileOutline,
  mdiFlagOutline,
  mdiFolderOutline,
  mdiGiftOutline,
  mdiGlobeModel,
  mdiHeartOutline,
  mdiHelpCircleOutline,
  mdiHomeOutline,
  mdiImageOutline,
  mdiInformationOutline,
  mdiKeyOutline,
  mdiKeyboardOutline,
  mdiLightbulbOutline,
  mdiLink,
  mdiLockOutline,
  mdiLogout,
  mdiMagnify,
  mdiMapMarkerOutline,
  mdiMenu,
  mdiMessageOutline,
  mdiMonitor,
  mdiMusicNoteOutline,
  mdiPaletteOutline,
  mdiPencilOutline,
  mdiPhoneOutline,
  mdiPlus,
  mdiPrinterOutline,
  mdiRefresh,
  mdiSendOutline,
  mdiServerOutline,
  mdiShieldOutline,
  mdiStarOutline,
  mdiSync,
  mdiTagOutline,
  mdiTarget,
  mdiUploadOutline,
  mdiVideoOutline,
  mdiWalletOutline,
  mdiWeatherPartlyCloudy,
  mdiWifi,
} from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "图标画廊", en: "Icon gallery" },
  searchLabel: { zh: "搜索图标", en: "Search icons" },
  searchPlaceholder: { zh: "搜索图标", en: "Search icons" },
  count: { zh: "已显示", en: "Showing" },
  copyHint: { zh: "点击图标复制代码", en: "Click an icon to copy its code" },
  copied: { zh: "已复制", en: "Copied" },
  empty: { zh: "未找到匹配的图标", en: "No matching icons" },
});

const galleryOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      home: mdiHomeOutline,
      account: mdiAccountOutline,
      cog: mdiCogOutline,
      bell: mdiBellOutline,
      cart: mdiCartOutline,
      heart: mdiHeartOutline,
      star: mdiStarOutline,
      cloud: mdiCloudOutline,
      download: mdiDownloadOutline,
      upload: mdiUploadOutline,
      email: mdiEmailOutline,
      calendar: mdiCalendarOutline,
      clock: mdiClockOutline,
      map: mdiMapMarkerOutline,
      camera: mdiCameraOutline,
      image: mdiImageOutline,
      music: mdiMusicNoteOutline,
      video: mdiVideoOutline,
      success: mdiCheckCircleOutline,
      warning: mdiAlertOutline,
      search: mdiMagnify,
      edit: mdiPencilOutline,
      delete: mdiDeleteOutline,
      plus: mdiPlus,
      close: mdiClose,
      menu: mdiMenu,
      check: mdiCheck,
      info: mdiInformationOutline,
      help: mdiHelpCircleOutline,
      phone: mdiPhoneOutline,
      message: mdiMessageOutline,
      send: mdiSendOutline,
      link: mdiLink,
      lock: mdiLockOutline,
      eye: mdiEyeOutline,
      bookmark: mdiBookmarkOutline,
      flag: mdiFlagOutline,
      folder: mdiFolderOutline,
      file: mdiFileOutline,
      printer: mdiPrinterOutline,
      refresh: mdiRefresh,
      sync: mdiSync,
      shield: mdiShieldOutline,
      wifi: mdiWifi,
      lightbulb: mdiLightbulbOutline,
      keyboard: mdiKeyboardOutline,
      monitor: mdiMonitor,
      cellphone: mdiCellphone,
      palette: mdiPaletteOutline,
      tag: mdiTagOutline,
      "arrow-left": mdiArrowLeft,
      "arrow-right": mdiArrowRight,
      "arrow-up": mdiArrowUp,
      "arrow-down": mdiArrowDown,
      "chevron-left": mdiChevronLeft,
      "chevron-right": mdiChevronRight,
      logout: mdiLogout,
      key: mdiKeyOutline,
      gift: mdiGiftOutline,
      wallet: mdiWalletOutline,
      "credit-card": mdiCreditCardOutline,
      car: mdiCarOutline,
      airplane: mdiAirplane,
      coffee: mdiCoffeeOutline,
      weather: mdiWeatherPartlyCloudy,
      battery: mdiBattery,
      globe: mdiGlobeModel,
      chart: mdiChartLine,
      target: mdiTarget,
      database: mdiDatabaseOutline,
      server: mdiServerOutline,
      code: mdiCodeTags,
    }),
  },
};

const ICON_NAMES = [
  "home",
  "account",
  "cog",
  "bell",
  "cart",
  "heart",
  "star",
  "cloud",
  "download",
  "upload",
  "email",
  "calendar",
  "clock",
  "map",
  "camera",
  "image",
  "music",
  "video",
  "success",
  "warning",
  "search",
  "edit",
  "delete",
  "plus",
  "close",
  "menu",
  "check",
  "info",
  "help",
  "phone",
  "message",
  "send",
  "link",
  "lock",
  "eye",
  "bookmark",
  "flag",
  "folder",
  "file",
  "printer",
  "refresh",
  "sync",
  "shield",
  "wifi",
  "lightbulb",
  "keyboard",
  "monitor",
  "cellphone",
  "palette",
  "tag",
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "arrow-down",
  "chevron-left",
  "chevron-right",
  "logout",
  "key",
  "gift",
  "wallet",
  "credit-card",
  "car",
  "airplane",
  "coffee",
  "weather",
  "battery",
  "globe",
  "chart",
  "target",
  "database",
  "server",
  "code",
];

const galleryItems = (): Array<{ name: string; size: number }> =>
  ICON_NAMES.map((name) => ({ name, size: 20 }));

const searchQuery = useRef("");
const normalizedQuery = (): string =>
  String(searchQuery.value || "")
    .trim()
    .toLowerCase();
const filteredGallery = (): Array<{ name: string; size: number }> => {
  const query = normalizedQuery();
  return query ? galleryItems().filter((item) => item.name.includes(query)) : galleryItems();
};
const hasResults = (): boolean => filteredGallery().length > 0;
const resultCount = (): number => filteredGallery().length;
const onSearch = (event: CustomEvent): void => searchQuery.set(String(event.detail ?? ""));

const copiedName = useRef("");
let copyTimer: ReturnType<typeof setTimeout> | undefined;

const writeClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const succeeded = document.execCommand?.("copy") ?? false;
  input.remove();
  if (!succeeded) throw new Error("Clipboard API is unavailable");
};

const codeFor = (item: { name: string; size: number }): string =>
  `<elf-icon name="${item.name}" size="${item.size}"></elf-icon>`;

const galleryTokens = (): Array<{ name: string; size: number; label: string; ariaLabel: string }> =>
  filteredGallery().map((item) => ({
    ...item,
    label: copiedName.value === item.name ? `${t("copied")} ✓` : item.name,
    ariaLabel: `${t("copyHint")}：${item.name}`,
  }));

const copyToken = async (name: string): Promise<void> => {
  const item = galleryItems().find((candidate) => candidate.name === name);
  if (!item) return;
  try {
    await writeClipboard(codeFor(item));
  } catch {
    return;
  }
  copiedName.set(item.name);
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => copiedName.set(""), 1600);
};

const onTokenClick = (event: MouseEvent): void => {
  const token = event
    .composedPath()
    .find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.classList.contains("icon-gallery-token"),
    );
  if (!token) return;
  const name = token.dataset.name ?? "";
  if (name) void copyToken(name);
};

const onTokenKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const token = event.target;
  if (!(token instanceof HTMLElement) || !token.classList.contains("icon-gallery-token")) return;
  event.preventDefault();
  const name = token.dataset.name ?? "";
  if (name) void copyToken(name);
};

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = undefined;
});

const galleryCode = `<elf-icon-provider :options.prop="galleryOptions">
  <elf-input label="Search icons" clearable>
    <elf-icon slot="prefix" name="search"></elf-icon>
  </elf-input>

  <div class="icon-gallery-grid">
    <elf-icon name="home" size="20"></elf-icon>
    <elf-icon name="account" size="20"></elf-icon>
    <elf-icon name="cog" size="20"></elf-icon>
    <elf-icon name="star" size="24" color="var(--elf-warning)"></elf-icon>
    <elf-icon name="success" size="28" color="var(--elf-success)"></elf-icon>
  </div>
</elf-icon-provider>`;

const galleryScript = `import { createSvgIconSet } from "@elfui/kit";

const galleryOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      home: mdiHomeOutline,
      account: mdiAccountOutline,
      cog: mdiCogOutline,
      search: mdiMagnify
    })
  }
};

// 画廊内置 72 个常用图标，输入框实时过滤；点击图标复制对应代码。
// The gallery ships with 72 common icons; click an icon to copy its code.`;

defineStyle(styles);

const PageIconEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${galleryCode} :script=${galleryScript}>
    <span slot="status" class="icon-gallery-search">
      <elf-icon-provider :options.prop=${galleryOptions}>
        <elf-input
          :modelValue.prop=${searchQuery.value}
          @update:modelValue=${onSearch}
          :label=${t("searchLabel")}
          :placeholder=${t("searchPlaceholder")}
          :aria-label=${t("searchPlaceholder")}
          clearable
          density="comfortable"
          variant="outlined"
        >
          <elf-icon slot="prefix" name="search" size="18"></elf-icon>
        </elf-input>
      </elf-icon-provider>
    </span>

    <elf-icon-provider :options.prop=${galleryOptions}>
      <div class="icon-gallery-panel">
        <div class="icon-gallery-meta">
          <span class="icon-gallery-hint">${t("copyHint")}</span>
          <span class="icon-gallery-count">${t("count")}：${resultCount()} / ${galleryItems().length}</span>
        </div>
        <div v-if=${hasResults()} class="icon-gallery-grid">
          <span
            v-for="item in galleryTokens()"
            :key="item.name"
            class="icon-gallery-token"
            role="button"
            tabindex="0"
            :data-name="item.name"
            :aria-label="item.ariaLabel"
            @click=${onTokenClick}
            @keydown=${onTokenKeydown}
          >
            <elf-icon :name="item.name" :size="item.size"></elf-icon>
            <small>{{ item.label }}</small>
          </span>
        </div>
        <div v-else class="icon-gallery-empty">${t("empty")}</div>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx4 };
