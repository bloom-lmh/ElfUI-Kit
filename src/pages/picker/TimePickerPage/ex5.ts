import { defineHtml, useRef } from "@elfui/core";

const shift = useRef<[string, string]>(["22:30", "02:15"]);
const touched = useRef(false);

const updateShift = (event: CustomEvent<[string, string]>): void => {
  shift.set((event.detail || ["", ""]) as [string, string]);
  touched.set(true);
};

const isComplete = (): boolean => Boolean(shift.value[0] && shift.value[1]);
const statusText = (): string =>
  isComplete() ? `${shift.value[0]} → 次日 ${shift.value[1]}` : touched.value ? "请选择完整值班时间" : "等待填写";

const code = `<elf-form label-position="top">
  <elf-form-item
    label="跨日值班时间"
    required
    :error="isComplete() ? '' : '请选择完整值班时间'"
  >
    <elf-time-picker
      :modelValue.prop="shift"
      is-range
      :step="900"
      @update:modelValue="updateShift"
    />
  </elf-form-item>
</elf-form>`;

const script = `const shift = useRef(["22:30", "02:15"]);
const touched = useRef(false);

const updateShift = (event) => {
  shift.set(event.detail);
  touched.set(true);
};

const isComplete = () => Boolean(shift.value[0] && shift.value[1]);`;

const PageTimePickerEx5 = defineHtml(`
  <elf-playground title="跨日范围与表单边界" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ statusText() }}</span>
    <div style="display:grid;place-items:center;width:100%;max-width:620px">
      <elf-card style="width:100%">
        <div style="padding:20px 22px">
          <elf-form label-position="top">
            <elf-form-item
              label="跨日值班时间"
              required
              :error=${touched && !isComplete() ? "请选择完整值班时间" : ""}
            >
              <elf-time-picker
                :modelValue.prop=${shift}
                is-range
                :step=${900}
                @update:modelValue=${updateShift}
              ></elf-time-picker>
            </elf-form-item>
          </elf-form>
          <p style="margin:12px 0 0;color:var(--elf-text-secondary);font-size:13px">
            结束时间早于开始时间时按次日计算，组件保留用户选择顺序。
          </p>
        </div>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageTimePickerEx5 };
