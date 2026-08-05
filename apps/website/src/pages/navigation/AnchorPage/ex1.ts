import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  section: { zh: "基础定位", en: "Basic positioning" },
  title: { zh: "滚动监听与点击定位", en: "Scroll spy and click navigation" },
  controls: { zh: "定位参数", en: "Positioning" },
  offset: { zh: "顶部偏移", en: "Top offset" },
  bounds: { zh: "激活边界", en: "Activation bounds" },
  smooth: { zh: "平滑滚动", en: "Smooth scrolling" },
  active: { zh: "当前", en: "Active" },
  profile: { zh: "个人资料", en: "Profile" },
  security: { zh: "账户安全", en: "Security" },
  notifications: { zh: "通知偏好", en: "Notifications" },
  billing: { zh: "账单与套餐", en: "Billing" },
  team: { zh: "团队成员", en: "Team" },
  admin: { zh: "管理员", en: "Admin" },
  name: { zh: "显示名称", en: "Display name" },
  nameValue: { zh: "林沐涵", en: "Lin Muhan" },
  email: { zh: "工作邮箱", en: "Work email" },
  emailValue: { zh: "lin@elfui.dev", en: "lin@elfui.dev" },
  password: { zh: "最近修改", en: "Last updated" },
  passwordValue: { zh: "2026-07-28", en: "Jul 28, 2026" },
  changePassword: { zh: "修改密码", en: "Change password" },
  twoFactor: { zh: "两步验证", en: "Two-factor auth" },
  twoFactorDesc: {
    zh: "登录时通过验证器应用二次确认身份",
    en: "Confirm sign-in with an authenticator app",
  },
  emailNotify: { zh: "邮件通知", en: "Email notifications" },
  pushNotify: { zh: "站内推送", en: "In-app notifications" },
  announcements: { zh: "公告", en: "Announcements" },
  releases: { zh: "版本更新", en: "Releases" },
  plan: { zh: "Pro 专业版", en: "Pro plan" },
  planPrice: { zh: "¥128 / 月", en: "¥128 / month" },
  nextBill: { zh: "下次扣费", en: "Next charge" },
  nextBillValue: { zh: "2026-08-15", en: "Aug 15, 2026" },
  managePlan: { zh: "管理套餐", en: "Manage plan" },
  member1: { zh: "张一", en: "Zhang Yi" },
  member1Email: { zh: "zhang@elfui.dev", en: "zhang@elfui.dev" },
  member1Role: { zh: "所有者", en: "Owner" },
  member2: { zh: "李思", en: "Li Si" },
  member2Email: { zh: "lisi@elfui.dev", en: "lisi@elfui.dev" },
  member2Role: { zh: "成员", en: "Member" },
  member3: { zh: "王然", en: "Wang Ran" },
  member3Email: { zh: "wangran@elfui.dev", en: "wangran@elfui.dev" },
  member3Role: { zh: "访客", en: "Guest" },
});

const active = useRef("#anchor-workspace-profile");
const offset = useRef(8);
const bounds = useRef(20);
const smooth = useRef<string[]>(["smooth"]);

const items = () => [
  { title: t("profile"), href: "#anchor-workspace-profile" },
  { title: t("security"), href: "#anchor-workspace-security" },
  { title: t("notifications"), href: "#anchor-workspace-notifications" },
  { title: t("billing"), href: "#anchor-workspace-billing" },
  { title: t("team"), href: "#anchor-workspace-team" },
];

const onChange = (event: CustomEvent<{ href: string }>): void => active.set(event.detail.href);
const onOffset = (event: CustomEvent<number>): void => offset.set(Number(event.detail) || 0);
const onBounds = (event: CustomEvent<number>): void => bounds.set(Number(event.detail) || 0);
const onSmooth = (event: CustomEvent<string[]>): void => smooth.set(event.detail || []);

const code = `<div class="anchor-demo-layout">
  <elf-anchor
    :items.prop="items"
    container="#anchor-workspace"
    :offset="offset"
    :bounds="bounds"
    :smooth.prop="smooth"
    @change="onChange"
  />
  <div id="anchor-workspace" class="anchor-document anchor-workspace">
    <section id="anchor-workspace-profile" class="anchor-card">
      <h3>Profile</h3>
      <elf-input label="Display name" model-value="Lin Muhan"></elf-input>
    </section>
  </div>
</div>`;

const script = `const active = useRef("#anchor-workspace-profile");
const offset = useRef(8);
const bounds = useRef(20);
const smooth = useRef(["smooth"]);

const items = [
  { title: "Profile", href: "#anchor-workspace-profile" },
  { title: "Security", href: "#anchor-workspace-security" },
  { title: "Billing", href: "#anchor-workspace-billing" }
];

const onChange = (event) => active.set(event.detail.href);`;

const PageAnchorEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("active")}: ${active.value}</span>
    <div slot="controls" style="display:grid;gap:14px">
      <strong style="font-size:var(--elf-font-size-sm)">${t("controls")}</strong>
      <elf-input-number variant="underlined" :label=${t("offset")} :modelValue=${offset.value} :min=${0} control-variant="stacked" @update:modelValue=${onOffset}></elf-input-number>
      <elf-input-number variant="underlined" :label=${t("bounds")} :modelValue=${bounds.value} :min=${0} control-variant="stacked" @update:modelValue=${onBounds}></elf-input-number>
      <elf-checkbox-group :modelValue.prop=${smooth.value} :options.prop=${[{ label: t("smooth"), value: "smooth" }]} @update:modelValue=${onSmooth}></elf-checkbox-group>
    </div>

    <div class="anchor-demo-layout">
      <elf-anchor
        :items.prop=${items()}
        container="#anchor-basic-scroll"
        :offset=${offset.value}
        :bounds=${bounds.value}
        :smooth.prop=${smooth.value.includes("smooth")}
        :modelValue.prop=${active.value}
        @change=${onChange}
      ></elf-anchor>

      <div id="anchor-basic-scroll" class="anchor-document anchor-workspace">
        <section id="anchor-workspace-profile" class="anchor-card">
          <header>
            <h3>${t("profile")}</h3>
            <span class="anchor-card-note">${t("admin")}</span>
          </header>
          <div class="anchor-card-body">
            <div class="anchor-profile-head">
              <span class="anchor-avatar anchor-avatar--primary">EL</span>
              <div class="anchor-profile-meta">
                <strong>${t("nameValue")}</strong>
                <small>${t("emailValue")}</small>
              </div>
            </div>
            <div class="anchor-field">
              <elf-input :label=${t("name")} :modelValue.prop=${t("nameValue")} variant="outlined"></elf-input>
            </div>
            <div class="anchor-field">
              <elf-input :label=${t("email")} :modelValue.prop=${t("emailValue")} variant="outlined"></elf-input>
            </div>
          </div>
        </section>

        <section id="anchor-workspace-security" class="anchor-card">
          <header><h3>${t("security")}</h3></header>
          <div class="anchor-card-body">
            <div class="anchor-row">
              <div class="anchor-field"><span>${t("password")}</span><strong class="anchor-value">${t("passwordValue")}</strong></div>
              <elf-button size="sm" variant="outlined">${t("changePassword")}</elf-button>
            </div>
            <div class="anchor-row">
              <div class="anchor-field"><span>${t("twoFactor")}</span><small class="anchor-hint">${t("twoFactorDesc")}</small></div>
              <elf-switch :modelValue.prop=${true}></elf-switch>
            </div>
          </div>
        </section>

        <section id="anchor-workspace-notifications" class="anchor-card">
          <header><h3>${t("notifications")}</h3></header>
          <div class="anchor-card-body">
            <div class="anchor-row">
              <span class="anchor-field-label">${t("emailNotify")}</span>
              <elf-switch :modelValue.prop=${true}></elf-switch>
            </div>
            <div class="anchor-row">
              <span class="anchor-field-label">${t("pushNotify")}</span>
              <elf-switch :modelValue.prop=${false}></elf-switch>
            </div>
            <div class="anchor-tags">
              <elf-tag size="sm" type="info">${t("announcements")}</elf-tag>
              <elf-tag size="sm">${t("releases")}</elf-tag>
            </div>
          </div>
        </section>

        <section id="anchor-workspace-billing" class="anchor-card">
          <header><h3>${t("billing")}</h3></header>
          <div class="anchor-card-body">
            <div class="anchor-row">
              <div class="anchor-plan">
                <strong>${t("plan")} · ${t("planPrice")}</strong>
                <small>${t("nextBill")}：${t("nextBillValue")}</small>
              </div>
              <elf-button size="sm" variant="outlined">${t("managePlan")}</elf-button>
            </div>
          </div>
        </section>

        <section id="anchor-workspace-team" class="anchor-card">
          <header><h3>${t("team")}</h3></header>
          <div class="anchor-card-body">
            <div class="anchor-row">
              <div class="anchor-member">
                <span class="anchor-avatar anchor-avatar--primary">ZY</span>
                <div class="anchor-member-info">
                  <strong>${t("member1")}</strong>
                  <small>${t("member1Email")}</small>
                </div>
              </div>
              <div class="anchor-member-state">
                <span class="anchor-status anchor-status--online"></span>
                <elf-tag size="sm" type="primary">${t("member1Role")}</elf-tag>
              </div>
            </div>
            <div class="anchor-row">
              <div class="anchor-member">
                <span class="anchor-avatar anchor-avatar--success">LS</span>
                <div class="anchor-member-info">
                  <strong>${t("member2")}</strong>
                  <small>${t("member2Email")}</small>
                </div>
              </div>
              <div class="anchor-member-state">
                <span class="anchor-status anchor-status--online"></span>
                <elf-tag size="sm">${t("member2Role")}</elf-tag>
              </div>
            </div>
            <div class="anchor-row">
              <div class="anchor-member">
                <span class="anchor-avatar anchor-avatar--warning">WR</span>
                <div class="anchor-member-info">
                  <strong>${t("member3")}</strong>
                  <small>${t("member3Email")}</small>
                </div>
              </div>
              <div class="anchor-member-state">
                <span class="anchor-status"></span>
                <elf-tag size="sm" variant="plain">${t("member3Role")}</elf-tag>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </elf-playground>
`);

export { PageAnchorEx1 };
