import { defineHtml, defineStyle, useReactive, useRef, useTemplateRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import type { FormRules } from "@elfui/kit-src/components/Form";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "登录表单", en: "Login form" },
  playground: { zh: "紧凑登录与即时校验", en: "Compact login with immediate validation" },
  waiting: { zh: "等待登录", en: "Waiting to sign in" },
  email: { zh: "邮箱", en: "Email" },
  password: { zh: "密码", en: "Password" },
  emailRequired: { zh: "请输入邮箱", en: "Enter an email" },
  emailInvalid: { zh: "邮箱格式不正确", en: "Invalid email format" },
  passwordRequired: { zh: "请输入密码", en: "Enter a password" },
  passwordMin: { zh: "密码至少 6 位", en: "Password must be at least 6 characters" },
  welcome: { zh: "欢迎回来", en: "Welcome back" },
  invalid: { zh: "请检查登录信息", en: "Check your login details" },
  subtitle: { zh: "使用你的 ElfUI 账号继续", en: "Continue with your ElfUI account" },
  remember: { zh: "保持登录", en: "Keep me signed in" },
  login: { zh: "登录", en: "Sign in" },
  hint: { zh: "至少 6 位", en: "At least 6 characters" },
});
interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
}

const formRef = useTemplateRef<FormHost>("loginForm");

const account = useReactive({
  email: "",
  password: "",
  remember: true,
});

const message = useRef(t("waiting"));

const rules: FormRules = {
  email: [
    { required: true, message: t("emailRequired"), trigger: "blur" },
    { type: "email", message: t("emailInvalid"), trigger: "blur" },
  ],
  password: [
    { required: true, message: t("passwordRequired"), trigger: "blur" },
    { min: 6, message: t("passwordMin"), trigger: "change" },
  ],
};

const submit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();
  message.set(valid ? `${t("welcome")}，${account.email}` : t("invalid"));
};

const code = `<elf-form ref="loginForm" :model.prop=\${account} :rules.prop=\${rules} label-position="top">
  <elf-form-item prop="email" label="${t("email")}" required>
    <elf-input v-model="account.email" />
  </elf-form-item>
  <elf-form-item prop="password" label="${t("password")}" required>
    <elf-input v-model="account.password" type="password" show-password />
  </elf-form-item>
</elf-form>`;

const script = `const account = useReactive({ email: "", password: "", remember: true });
const valid = await loginForm.value?.validate();

const rules = {
    email: [
        { required: true, message: "${t("emailRequired")}", trigger: "blur" },
        { type: "email", message: "${t("emailInvalid")}", trigger: "blur" }
    ],
    password: [
        { required: true, message: "${t("passwordRequired")}", trigger: "blur" },
        { min: 6, message: "${t("passwordMin")}", trigger: "change" }
    ]
};`;

defineStyle(demoStyles);

const PageFormEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${message.value}</span>
    <elf-card class="form-demo-card is-compact" variant="outlined">
      <div class="login-heading">
        <strong>${t("welcome")}</strong>
        <span>${t("subtitle")}</span>
      </div>
      <elf-form ref="loginForm" :model.prop=${account} :rules.prop=${rules} label-position="top">
        <elf-form-item prop="email" :label=${t("email")} required>
          <elf-input v-model="account.email" :label=${t("email")} placeholder="name@elfui.dev" clearable />
        </elf-form-item>
        <elf-form-item prop="password" :label=${t("password")} required>
          <elf-input
            v-model="account.password"
            :label=${t("password")}
            type="password"
            :placeholder=${t("hint")}
            show-password
          />
        </elf-form-item>
        <elf-form-item>
          <elf-checkbox v-model="account.remember">${t("remember")}</elf-checkbox>
        </elf-form-item>
        <elf-button type="primary" style="width:100%" @click=${submit}>${t("login")}</elf-button>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx5 };
