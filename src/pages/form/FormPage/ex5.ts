import { defineHtml, defineStyle, useReactive, useRef, useTemplateRef } from "@elfui/core";

import type { FormRules } from "../../../components/Form";
import demoStyles from "./demo.scss?inline";

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
}

const formRef = useTemplateRef<FormHost>("loginForm");

const account = useReactive({
  email: "",
  password: "",
  remember: true
});

const message = useRef("等待登录");

const rules: FormRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少 6 位", trigger: "change" }
  ]
};

const submit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();
  message.set(valid ? `欢迎回来，${account.email}` : "请检查登录信息");
};

const code = `<elf-form ref="loginForm" :model.prop=\${account} :rules.prop=\${rules} label-position="top">
  <elf-form-item prop="email" label="邮箱" required>
    <elf-input v-model="account.email" />
  </elf-form-item>
  <elf-form-item prop="password" label="密码" required>
    <elf-input v-model="account.password" type="password" show-password />
  </elf-form-item>
</elf-form>`;

const script = `const account = useReactive({ email: "", password: "", remember: true });
const valid = await loginForm.value?.validate();

const rules = {
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "邮箱格式不正确", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码至少 6 位", trigger: "change" }
    ]
};`;

defineStyle(demoStyles);

const PageFormEx5 = defineHtml(`
  <h2>登录表单</h2>
  <elf-playground title="紧凑登录与即时校验" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${message.value}</span>
    <elf-card class="form-demo-card is-compact" variant="outlined">
      <div class="login-heading">
        <strong>欢迎回来</strong>
        <span>使用你的 ElfUI 账号继续</span>
      </div>
      <elf-form ref="loginForm" :model.prop=${account} :rules.prop=${rules} label-position="top">
        <elf-form-item prop="email" label="邮箱" required>
          <elf-input v-model="account.email" label="邮箱" placeholder="name@elfui.dev" clearable />
        </elf-form-item>
        <elf-form-item prop="password" label="密码" required>
          <elf-input
            v-model="account.password"
            label="密码"
            type="password"
            placeholder="至少 6 位"
            show-password
          />
        </elf-form-item>
        <elf-form-item>
          <elf-checkbox v-model="account.remember">保持登录</elf-checkbox>
        </elf-form-item>
        <elf-button type="primary" style="width:100%" @click=${submit}>登录</elf-button>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx5 };
