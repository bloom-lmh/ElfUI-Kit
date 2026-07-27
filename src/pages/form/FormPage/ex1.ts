import { defineHtml, defineStyle, useReactive } from "@elfui/core";

import type { FormRules } from "../../../components/Form";
import demoStyles from "./demo.scss?inline";

const formData = useReactive({
  name: "",
  email: "",
  bio: "",
  gender: "",
  hobbies: [] as string[],
  newsletter: true,
  password: "",
  password2: ""
});

const rules: FormRules = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "长度 2-20", trigger: "change" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  bio: [{ max: 200, message: "不超过200字", trigger: "input" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "至少6位", trigger: "change" }
  ],
  password2: [
    { required: true, message: "请再次输入", trigger: "blur" },
    { fields: "password", message: "两次密码不一致", trigger: "blur" }
  ]
};

const code1 = `const formData = useReactive({ name: "", email: "", ... })
const rules: FormRules = { name: [{ required: true }], ... }`;

defineStyle(demoStyles);

const PageFormEx1 = defineHtml(`
  <h2>综合示例</h2>
  <elf-playground title="完整表单" :code="code1">
    <elf-card
      class="form-demo-card"
      variant="outlined"
      title="创建个人资料"
      subtitle="使用 Card 组织长表单的标题和内容层级"
    >
      <elf-form :model="formData" :rules="rules" label-position="top">
        <div class="form-demo-grid">
          <elf-form-item prop="name" label="姓名" required>
            <elf-input v-model="formData.name" placeholder="2-20 字符" clearable />
          </elf-form-item>
          <elf-form-item prop="email" label="邮箱" required>
            <elf-input v-model="formData.email" placeholder="example@elfui.dev" />
          </elf-form-item>
          <elf-form-item prop="password" label="密码" required>
            <elf-input
              v-model="formData.password"
              type="password"
              placeholder="至少6位"
              show-password
            />
          </elf-form-item>
          <elf-form-item prop="password2" label="确认密码" required>
            <elf-input v-model="formData.password2" type="password" placeholder="再次输入" />
          </elf-form-item>
          <elf-form-item prop="gender" label="性别">
            <elf-radio-group v-model="formData.gender">
              <elf-radio value="male">男</elf-radio>
              <elf-radio value="female">女</elf-radio>
            </elf-radio-group>
          </elf-form-item>
          <elf-form-item label="兴趣">
            <elf-checkbox-group v-model="formData.hobbies">
              <elf-checkbox value="music">音乐</elf-checkbox>
              <elf-checkbox value="sports">运动</elf-checkbox>
              <elf-checkbox value="travel">旅行</elf-checkbox>
            </elf-checkbox-group>
          </elf-form-item>
          <elf-form-item class="form-demo-span-2" label="订阅周报">
            <elf-switch v-model="formData.newsletter" active-text="开" inactive-text="关" />
          </elf-form-item>
          <elf-form-item class="form-demo-span-2" prop="bio" label="个人简介">
            <elf-textarea
              v-model="formData.bio"
              rows="3"
              maxlength="200"
              show-count
              placeholder="不超过200字"
            />
          </elf-form-item>
        </div>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx1 };
