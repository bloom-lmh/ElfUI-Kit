import { defineHtml, defineStyle, useReactive } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import type { FormRules } from "@elfui/kit-src/components/Form";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "综合示例", en: "Comprehensive example" },
  playground: { zh: "完整表单", en: "Complete form" },
  card: { zh: "创建个人资料", en: "Create a profile" },
  subtitle: {
    zh: "使用卡片组织长表单的标题和内容层级",
    en: "Use a card to organize heading and content hierarchy in a long form.",
  },
  name: { zh: "姓名", en: "Name" },
  email: { zh: "邮箱", en: "Email" },
  password: { zh: "密码", en: "Password" },
  confirm: { zh: "确认密码", en: "Confirm password" },
  gender: { zh: "性别", en: "Gender" },
  male: { zh: "男", en: "Male" },
  female: { zh: "女", en: "Female" },
  interests: { zh: "兴趣", en: "Interests" },
  music: { zh: "音乐", en: "Music" },
  sports: { zh: "运动", en: "Sports" },
  travel: { zh: "旅行", en: "Travel" },
  newsletter: { zh: "订阅周报", en: "Weekly newsletter" },
  on: { zh: "开", en: "On" },
  off: { zh: "关", en: "Off" },
  bio: { zh: "个人简介", en: "Biography" },
  nameHint: { zh: "2–20 个字符", en: "2–20 characters" },
  six: { zh: "至少 6 位", en: "At least 6 characters" },
  again: { zh: "再次输入", en: "Enter again" },
  bioHint: { zh: "不超过 200 字", en: "Up to 200 characters" },
  nameRequired: { zh: "请输入姓名", en: "Enter a name" },
  nameLength: { zh: "长度 2–20", en: "Length must be 2–20" },
  emailRequired: { zh: "请输入邮箱", en: "Enter an email" },
  emailInvalid: { zh: "邮箱格式不正确", en: "Invalid email format" },
  genderRequired: { zh: "请选择性别", en: "Select a gender" },
  bioMax: { zh: "不超过 200 字", en: "No more than 200 characters" },
  passwordRequired: { zh: "请输入密码", en: "Enter a password" },
  passwordMin: { zh: "至少 6 位", en: "At least 6 characters" },
  confirmRequired: { zh: "请再次输入", en: "Enter the password again" },
  mismatch: { zh: "两次密码不一致", en: "Passwords do not match" },
});

const formData = useReactive({
  name: "",
  email: "",
  bio: "",
  gender: "",
  hobbies: [] as string[],
  newsletter: true,
  password: "",
  password2: "",
});

const rules: FormRules = {
  name: [
    { required: true, message: t("nameRequired"), trigger: "blur" },
    { min: 2, max: 20, message: t("nameLength"), trigger: "change" },
  ],
  email: [
    { required: true, message: t("emailRequired"), trigger: "blur" },
    { type: "email", message: t("emailInvalid"), trigger: "blur" },
  ],
  gender: [{ required: true, message: t("genderRequired"), trigger: "change" }],
  bio: [{ max: 200, message: t("bioMax"), trigger: "input" }],
  password: [
    { required: true, message: t("passwordRequired"), trigger: "blur" },
    { min: 6, message: t("passwordMin"), trigger: "change" },
  ],
  password2: [
    { required: true, message: t("confirmRequired"), trigger: "blur" },
    { fields: "password", message: t("mismatch"), trigger: "blur" },
  ],
};

const code1 = `const formData = useReactive({ name: "", email: "", ... })
const rules: FormRules = { name: [{ required: true }], ... }`;

defineStyle(demoStyles);

const PageFormEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code="code1">
    <elf-card
      class="form-demo-card"
      variant="outlined"
      :title=${t("card")}
      :subtitle=${t("subtitle")}
    >
      <elf-form :model="formData" :rules="rules" label-position="top">
        <div class="form-demo-grid">
          <elf-form-item prop="name" :label=${t("name")} required>
            <elf-input v-model="formData.name" :placeholder=${t("nameHint")} clearable />
          </elf-form-item>
          <elf-form-item prop="email" :label=${t("email")} required>
            <elf-input v-model="formData.email" placeholder="example@elfui.dev" />
          </elf-form-item>
          <elf-form-item prop="password" :label=${t("password")} required>
            <elf-input
              v-model="formData.password"
              type="password"
              :placeholder=${t("six")}
              show-password
            />
          </elf-form-item>
          <elf-form-item prop="password2" :label=${t("confirm")} required>
            <elf-input v-model="formData.password2" type="password" :placeholder=${t("again")} />
          </elf-form-item>
          <elf-form-item prop="gender" :label=${t("gender")}>
            <elf-radio-group v-model="formData.gender">
              <elf-radio value="male">${t("male")}</elf-radio>
              <elf-radio value="female">${t("female")}</elf-radio>
            </elf-radio-group>
          </elf-form-item>
          <elf-form-item :label=${t("interests")}>
            <elf-checkbox-group v-model="formData.hobbies">
              <elf-checkbox value="music">${t("music")}</elf-checkbox>
              <elf-checkbox value="sports">${t("sports")}</elf-checkbox>
              <elf-checkbox value="travel">${t("travel")}</elf-checkbox>
            </elf-checkbox-group>
          </elf-form-item>
          <elf-form-item class="form-demo-span-2" :label=${t("newsletter")}>
            <elf-switch v-model="formData.newsletter" :active-text=${t("on")} :inactive-text=${t("off")} />
          </elf-form-item>
          <elf-form-item class="form-demo-span-2" prop="bio" :label=${t("bio")}>
            <elf-textarea
              v-model="formData.bio"
              rows="3"
              maxlength="200"
              show-count
              :placeholder=${t("bioHint")}
            />
          </elf-form-item>
        </div>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx1 };
